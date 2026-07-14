# Admin analytics serverless API

This folder contains a Cloudflare Worker that can serve `/admin` analytics data from Google Analytics Data API.

GitHub Pages cannot run backend code. Deploy this Worker separately, protect it with Cloudflare Access, then set `PUBLIC_ADMIN_API_URL` in GitHub Actions Variables.

## Required protection

Do not expose this Worker as a public unauthenticated API. Use Cloudflare Access on the Worker route so only your account can call it.

## Google setup

1. Create a Google Cloud service account.
2. Enable `Google Analytics Data API`.
3. Add the service account email to the GA4 property with Viewer access.
4. Store these Worker variables/secrets:
   - `GA_PROPERTY_ID`: `514244650`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: service account email
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`: service account private key
   - `ALLOWED_ORIGIN`: `https://choidz.github.io`

## Blog setup

After the Worker is deployed and protected, add this GitHub Actions variable:

`PUBLIC_ADMIN_API_URL=https://your-worker.example.com`

Then redeploy the blog. `/admin` will call:

`https://your-worker.example.com/analytics/summary`

If `PUBLIC_ADMIN_API_URL` is empty, `/admin` falls back to direct Google OAuth in the browser.
