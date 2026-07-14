const DEFAULT_ALLOWED_ORIGIN = "https://choidz.github.io";
const GA_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const GA_API_BASE = "https://analyticsdata.googleapis.com/v1beta";

let cachedToken = null;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
    const corsHeaders = buildCorsHeaders(origin, allowedOrigin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    if (request.method !== "GET" || url.pathname !== "/analytics/summary") {
      return json({ error: "Not found" }, 404, corsHeaders);
    }

    if (origin && origin !== allowedOrigin) {
      return json({ error: "Origin is not allowed" }, 403, corsHeaders);
    }

    try {
      const propertyId = requireEnv(env, "GA_PROPERTY_ID");
      const accessToken = await getAccessToken(env);
      const [realtime, pages] = await Promise.all([
        gaRequest(propertyId, "runRealtimeReport", {
          dimensions: [{ name: "unifiedScreenName" }],
          metrics: [{ name: "activeUsers" }],
          limit: 10,
          orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        }, accessToken),
        gaRequest(propertyId, "runReport", {
          dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
          dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
          metrics: [{ name: "screenPageViews" }, { name: "totalUsers" }],
          dimensionFilter: {
            filter: {
              fieldName: "pagePath",
              stringFilter: { matchType: "BEGINS_WITH", value: "/blog/" },
            },
          },
          limit: 30,
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        }, accessToken),
      ]);

      return json(toSummary(realtime, pages), 200, corsHeaders);
    } catch (error) {
      return json({ error: error.message || "Admin analytics failed" }, 500, corsHeaders);
    }
  },
};

function buildCorsHeaders(origin, allowedOrigin) {
  return {
    "Access-Control-Allow-Origin": origin === allowedOrigin ? origin : allowedOrigin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
}

function json(payload, status, headers) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function requireEnv(env, name) {
  const value = env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

async function getAccessToken(env) {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 60) {
    return cachedToken.value;
  }

  const serviceAccountEmail = requireEnv(env, "GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = requireEnv(env, "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n");
  const jwt = await createJwt(serviceAccountEmail, privateKey, now);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: jwt,
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || "Google token request failed");
  }

  cachedToken = {
    value: payload.access_token,
    expiresAt: now + Number(payload.expires_in || 3600),
  };
  return cachedToken.value;
}

async function createJwt(serviceAccountEmail, privateKey, now) {
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: serviceAccountEmail,
    scope: GA_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };
  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedClaim = base64Url(JSON.stringify(claim));
  const unsignedToken = `${encodedHeader}.${encodedClaim}`;
  const key = await importPrivateKey(privateKey);
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsignedToken)
  );
  return `${unsignedToken}.${base64UrlBytes(signature)}`;
}

async function importPrivateKey(privateKey) {
  const cleanKey = privateKey
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const binary = Uint8Array.from(atob(cleanKey), (char) => char.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    binary.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function base64Url(value) {
  return base64UrlBytes(new TextEncoder().encode(value));
}

function base64UrlBytes(value) {
  const bytes = value instanceof ArrayBuffer ? new Uint8Array(value) : value;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function gaRequest(propertyId, method, body, accessToken) {
  const response = await fetch(`${GA_API_BASE}/properties/${propertyId}:${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || "Google Analytics API request failed");
  }
  return payload;
}

function metric(row, index) {
  return Number(row.metricValues?.[index]?.value || 0);
}

function dimension(row, index) {
  return row.dimensionValues?.[index]?.value || "";
}

function toSummary(realtime, pages) {
  const realtimeRows = realtime.rows || [];
  const pageRows = pages.rows || [];
  return {
    realtime: {
      activeUsers: realtimeRows.reduce((sum, row) => sum + metric(row, 0), 0),
      rows: realtimeRows.map((row) => [dimension(row, 0) || "/", String(metric(row, 0))]),
    },
    pages: {
      views: pageRows.reduce((sum, row) => sum + metric(row, 0), 0),
      users: pageRows.reduce((sum, row) => sum + metric(row, 1), 0),
      rows: pageRows.map((row) => [dimension(row, 0), String(metric(row, 0)), String(metric(row, 1))]),
    },
  };
}
