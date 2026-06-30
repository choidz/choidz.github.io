import * as cheerio from "cheerio";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import TurndownService from "turndown";

const SITE_URL = "https://choidz.github.io";
const POSTS_DIR = path.join(process.cwd(), "public", "posts");
const IMAGES_DIR = path.join(process.cwd(), "public", "images", "posts");
const AGENT_USAGE_DIR = path.join(process.cwd(), "public", "agent-usage");
const AGENT_USAGE_PATH = path.join(AGENT_USAGE_DIR, "latest.json");
const MANIFEST_PATH = path.join(POSTS_DIR, "index.json");
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const DEFAULT_POST_COUNT = 2;
const MAX_POST_COUNT = 2;
const MAX_IMAGES_PER_POST = 2;
const MAX_IMAGE_CANDIDATES = 16;
const MIN_IMAGE_PLACEMENT_SCORE = 12;
const MIN_BODY_CHARS = 1600;
const MIN_H2_COUNT = 3;
const TISTORY_SEARCH_RESULTS = 8;
const VELOG_SEARCH_RESULTS = 8;
const NAVER_SEARCH_RESULTS = 0;
const MAX_SOURCE_ARTICLES = 5;
const MAX_ATTEMPTS_PER_POST = 4;
const REJECT_IMAGE_PATTERN =
  /advert|advertise|ads?|banner|logo|profile|avatar|emoji|icon|comment|sponsor|promo|coupon|qr|placeholder|post-thumbnail|thumbnail|spinner|loading|blank|sprite|training|course|certified|trainer|webinar|seminar|lecture|웨비나|교육|세미나|강의|이벤트|패키지|공유|할인|프로모션|신청/i;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const openAiUsage = {
  calls: 0,
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
  summaryLogged: false,
};

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

function recordOpenAiUsage(usage = {}) {
  const promptTokens = Number(usage.prompt_tokens || 0);
  const completionTokens = Number(usage.completion_tokens || 0);
  const totalTokens = Number(usage.total_tokens || promptTokens + completionTokens);

  openAiUsage.calls += 1;
  openAiUsage.promptTokens += promptTokens;
  openAiUsage.completionTokens += completionTokens;
  openAiUsage.totalTokens += totalTokens;

  console.log(
    `[agent] openai usage call=${openAiUsage.calls} prompt=${promptTokens} completion=${completionTokens} total=${totalTokens}`
  );
}

function logOpenAiUsageSummary() {
  if (openAiUsage.summaryLogged) return;
  openAiUsage.summaryLogged = true;
  console.log(
    `[agent] openai usage summary calls=${openAiUsage.calls} prompt=${openAiUsage.promptTokens} completion=${openAiUsage.completionTokens} total=${openAiUsage.totalTokens}`
  );
}

async function writeOpenAiUsageReport(extra = {}) {
  try {
    await mkdir(AGENT_USAGE_DIR, { recursive: true });
    await writeFile(
      AGENT_USAGE_PATH,
      `${JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          model: OPENAI_MODEL,
          usage: {
            calls: openAiUsage.calls,
            promptTokens: openAiUsage.promptTokens,
            completionTokens: openAiUsage.completionTokens,
            totalTokens: openAiUsage.totalTokens,
          },
          ...extra,
        },
        null,
        2
      )}\n`,
      "utf8"
    );
  } catch (error) {
    console.warn(`[warn] failed to write openai usage report: ${error.message}`);
  }
}

const TOPIC_BANK = {
  "#DevOps": [
    "GitHub Actions permission denied 해결",
    "GitHub Actions npm ci 캐시 오류 해결",
    "Docker bind address already in use 해결",
    "Docker no space left on device 해결",
    "Docker container exited 137 원인과 해결",
    "Kubernetes CrashLoopBackOff 원인과 해결",
    "Kubernetes ImagePullBackOff 해결",
    "Kubernetes Pending pod 원인 분석",
    "Nginx 502 Bad Gateway 원인과 해결",
    "CI/CD 배포 실패 롤백 체크리스트",
    "RabbitMQ connection refused 해결",
    "Kafka consumer lag 급증 원인과 해결",
  ],
  "#Linux": [
    "no space left on device 해결",
    "permission denied 권한 오류 해결",
    "systemctl failed to start 원인 분석",
    "SSH permission denied publickey 해결",
    "connection refused 원인과 확인 방법",
    "too many open files 해결",
    "cannot allocate memory 원인과 해결",
    "disk usage 100 percent 원인 분석",
    "crontab 실행 안됨 원인과 해결",
    "logrotate 동작 안함 해결",
    "port already in use 확인과 종료",
    "server load average 높을 때 원인 분석",
  ],
  "#ElasticSearch": [
    "Elasticsearch circuit_breaking_exception 해결",
    "Elasticsearch heap memory 부족 해결",
    "Elasticsearch cluster red status 해결",
    "Elasticsearch unassigned shards 원인과 해결",
    "Elasticsearch mapper_parsing_exception 해결",
    "Elasticsearch search_phase_execution_exception 해결",
    "Elasticsearch read_only_allow_delete 해제",
    "Kibana server is not ready yet 해결",
    "Kibana no data views found 해결",
    "Elasticsearch slow query 원인 분석",
  ],
  "#Grafana": [
    "Grafana no data 표시 원인과 해결",
    "Grafana datasource connection failed 해결",
    "Grafana alert rule not firing 해결",
    "Grafana panel query error 해결",
    "Grafana time range 때문에 데이터 안보임 해결",
    "Prometheus targets down 원인과 해결",
    "Prometheus query timeout 해결",
    "Grafana login failed 원인과 해결",
  ],
  "#Zabbix": [
    "Zabbix agent is not available 해결",
    "Zabbix unsupported item key 해결",
    "Zabbix cannot connect to agent 해결",
    "Zabbix active checks not working 해결",
    "Zabbix trigger false positive 줄이는 방법",
    "Zabbix low level discovery 안됨 해결",
    "Zabbix server is not running 해결",
    "Zabbix proxy no data 수집 안됨 해결",
  ],
  "#Frontend": [
    "npm err eresolve unable to resolve dependency tree 해결",
    "npm err enoent package.json 없음 해결",
    "vite dev server port already in use 해결",
    "Next.js hydration failed 해결",
    "Next.js module not found 해결",
    "React maximum update depth exceeded 해결",
    "Astro build failed 원인과 해결",
    "CORS policy blocked 오류 해결",
  ],
  "#Other": [
    "Git non-fast-forward rejected 해결",
    "Git merge conflict 해결 순서",
    "Git detached HEAD 원인과 해결",
    "Git authentication failed 해결",
    "DBeaver public key retrieval is not allowed 해결",
    "MySQL access denied for user 해결",
    "Jenkins permission denied workspace 해결",
    "Java OutOfMemoryError 원인과 해결",
    "HTTP 504 gateway timeout 원인과 해결",
  ],
};

function normalizeTag(tag) {
  if (!tag) return "#Other";
  return tag.startsWith("#") ? tag : `#${tag}`;
}

function slugify(text) {
  return String(text)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Script=Hangul}a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

const SIMILARITY_STOP_WORDS = new Set([
  "가이드",
  "정리",
  "실무",
  "전략",
  "기본",
  "점검",
  "운영",
  "활용",
  "방법",
  "소개",
  "완벽",
  "위한",
  "에서",
  "으로",
  "그리고",
  "하기",
  "만들기",
  "guide",
  "basic",
  "tips",
  "strategy",
  "overview",
  "the",
  "and",
  "for",
  "with",
]);

const RELEVANCE_GENERIC_TOKENS = new Set([
  "해결",
  "원인",
  "오류",
  "에러",
  "문제",
  "방법",
  "분석",
  "확인",
  "실무",
  "가이드",
  "정리",
  "troubleshooting",
  "error",
  "issue",
  "problem",
  "fix",
  "solve",
  "solution",
  "guide",
  "how",
  "why",
  "training",
  "course",
  "certified",
  "trainer",
]);

function normalizeForSimilarity(text) {
  return String(text || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/ci\s*\/\s*cd|cicd/g, "cicd")
    .replace(/github\s+actions/g, "githubactions")
    .replace(/[^\p{Script=Hangul}a-z0-9]+/gu, " ")
    .trim();
}

function similarityTokens(...values) {
  return new Set(
    values
      .flatMap((value) => normalizeForSimilarity(value).split(/\s+/))
      .map((token) => token.replace(/하기$/, ""))
      .filter((token) => token.length > 1 && !SIMILARITY_STOP_WORDS.has(token))
  );
}

function similarityScore(left, right) {
  if (!left.size || !right.size) return { shared: 0, ratio: 0 };

  let shared = 0;
  for (const token of left) {
    if (right.has(token)) shared += 1;
  }

  return { shared, ratio: shared / Math.min(left.size, right.size) };
}

function relevanceTokens(...values) {
  const tokens = similarityTokens(...values);
  for (const token of RELEVANCE_GENERIC_TOKENS) {
    tokens.delete(token);
  }
  return tokens;
}

function sourceRelevanceScore(article, topic = "", category = "") {
  const topicTokens = relevanceTokens(topic, category.replace("#", ""));
  if (!topicTokens.size) return 0;

  const titleTokens = relevanceTokens(article.title);
  const bodyTokens = relevanceTokens(article.content_md, article.snippet);
  const titleShared = similarityScore(topicTokens, titleTokens).shared;
  const bodyShared = similarityScore(topicTokens, bodyTokens).shared;

  if (titleShared >= 2) return titleShared * 2 + bodyShared;
  if (bodyShared >= 3) return bodyShared;
  return 0;
}

function isSourceRelevant(article, topic = "", category = "") {
  return sourceRelevanceScore(article, topic, category) > 0;
}

function findSimilarPost({ topic = "", title = "", slug = "" }, posts) {
  const targetTokens = similarityTokens(topic, title, slug);
  const targetText = normalizeForSimilarity(`${topic} ${title} ${slug}`);

  for (const post of posts) {
    const postText = normalizeForSimilarity(
      `${post.title || ""} ${post.slug || ""} ${post.sourceTopic || ""}`
    );
    if (
      targetText.length >= 10 &&
      postText.length >= 10 &&
      (targetText.includes(postText) || postText.includes(targetText))
    ) {
      return post;
    }

    const postTokens = similarityTokens(
      post.title,
      post.slug,
      post.sourceTopic,
      ...(Array.isArray(post.tags) ? post.tags : [])
    );
    const { shared, ratio } = similarityScore(targetTokens, postTokens);

    if ((shared >= 2 && ratio >= 0.7) || (shared >= 3 && ratio >= 0.5) || shared >= 4) {
      return post;
    }
  }

  return null;
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function nowKstDate() {
  return new Date(Date.now() + KST_OFFSET_MS);
}

function todayIso() {
  return nowKstDate().toISOString().slice(0, 10);
}

function dayOfYear() {
  const now = nowKstDate();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
  return Math.floor((now - start) / 86400000);
}

function chooseCategory(posts, index = 0) {
  const requestedRaw = (process.env.AGENT_CATEGORY || "").trim();
  const requested = requestedRaw ? normalizeTag(requestedRaw) : "";
  if (requested && TOPIC_BANK[requested]) return requested;

  const counts = new Map();
  for (const post of posts) {
    for (const tag of post.tags || []) {
      const normalized = normalizeTag(tag);
      if (TOPIC_BANK[normalized]) {
        counts.set(normalized, (counts.get(normalized) || 0) + 1);
      }
    }
  }

  const ranked = Object.keys(TOPIC_BANK)
    .map((tag) => ({ tag, count: counts.get(tag) || 0 }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .map((item) => item.tag);

  return ranked[(dayOfYear() + index) % ranked.length] || "#DevOps";
}

function chooseTopic(category, posts, usedTopics = new Set(), index = 0) {
  const requested = (process.env.AGENT_TOPIC || "").trim();
  if (requested && index === 0) {
    const duplicate = findSimilarPost({ topic: requested }, posts);
    if (!duplicate) return requested;
    console.log(`[agent] requested topic already covered: ${duplicate.slug}`);
  }

  const topics = TOPIC_BANK[category] || TOPIC_BANK["#DevOps"];
  const offset = (dayOfYear() + index) % topics.length;

  for (let i = 0; i < topics.length; i += 1) {
    const topic = topics[(offset + i) % topics.length];
    if (!usedTopics.has(topic) && !findSimilarPost({ topic }, posts)) {
      return topic;
    }
  }

  return `${topics[offset]} 실무 정리 ${todayIso()}-${index + 1}`;
}

async function httpGet(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  return response.text();
}

async function httpGetBytes(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8",
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      Referer: SITE_URL,
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`Not an image: ${contentType || "unknown content type"}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 4096) throw new Error("Image is too small");
  if (bytes.length > 8 * 1024 * 1024) throw new Error("Image is too large");
  const dimensions = getImageDimensions(bytes, contentType);
  if (dimensions) {
    const ratio = dimensions.width / dimensions.height;
    if (dimensions.width < 320 || dimensions.height < 160) {
      throw new Error(`Image dimensions are too small: ${dimensions.width}x${dimensions.height}`);
    }
    if (ratio > 4 || ratio < 0.2) {
      throw new Error(`Image aspect ratio looks like an ad banner: ${dimensions.width}x${dimensions.height}`);
    }
  }
  return { bytes, contentType };
}

function getImageDimensions(bytes, contentType) {
  if (contentType.includes("png") && bytes.length >= 24) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }

  if ((contentType.includes("jpeg") || contentType.includes("jpg")) && bytes.length >= 4) {
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1];
      const length = bytes.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xc3) {
        return {
          height: bytes.readUInt16BE(offset + 5),
          width: bytes.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + length;
    }
  }

  return null;
}

function getPostCount() {
  const raw = Number(process.env.AGENT_POST_COUNT || DEFAULT_POST_COUNT);
  if (!Number.isFinite(raw) || raw < 1) return DEFAULT_POST_COUNT;
  return Math.max(1, Math.min(Math.floor(raw), MAX_POST_COUNT));
}

function makeAbsoluteUrl(src, baseUrl) {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return "";
  try {
    return new URL(src, baseUrl).toString();
  } catch {
    return "";
  }
}

function imageExtension(contentType, url) {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  const match = new URL(url).pathname.match(/\.(png|jpe?g|webp|gif)$/i);
  return match ? match[1].replace("jpeg", "jpg").toLowerCase() : "jpg";
}

function isRejectedImage(src, alt = "") {
  if (!src) return true;
  if (/\.(svg|ico)(?:$|\?)/i.test(src)) return true;
  return REJECT_IMAGE_PATTERN.test(`${src} ${alt}`);
}

function compactText(text, limit = 500) {
  return String(text || "").replace(/\s+/g, " ").trim().slice(0, limit);
}

function imageContextText($, image) {
  const figure = image.closest("figure");
  const parent = image.parent();
  const block = image.closest("p, li, section, article, figure");
  const context = [
    image.attr("alt") || "",
    image.attr("title") || "",
    figure.find("figcaption").text(),
    parent.text(),
    block.prev().text(),
    block.next().text(),
  ];

  return compactText(context.join(" "));
}

function collectImageUrls($, container, baseUrl, sourceUrl) {
  const candidates = [];
  const seen = new Set();

  const bestFromSrcset = (srcset = "") =>
    String(srcset)
      .split(",")
      .map((part) => part.trim().split(/\s+/)[0])
      .filter(Boolean)
      .at(-1) || "";

  const add = (src, alt = "", contextText = "") => {
    const absolute = makeAbsoluteUrl(src, baseUrl);
    if (!absolute || seen.has(absolute)) return;
    if (isRejectedImage(absolute, `${alt} ${contextText}`)) return;
    seen.add(absolute);
    candidates.push({
      url: absolute,
      alt: compactText(alt, 120),
      contextText,
      sourceUrl,
    });
  };

  container.find("img").each((_, element) => {
    const image = $(element);
    add(
      image.attr("data-lazy-src") ||
        image.attr("data-src") ||
        image.attr("data-original") ||
        bestFromSrcset(image.attr("srcset")) ||
        bestFromSrcset(image.attr("data-srcset")) ||
        image.attr("src") ||
        "",
      image.attr("alt") || "",
      imageContextText($, image)
    );
  });

  return candidates.slice(0, 24);
}

function scoreImageCandidate(image, topic = "", category = "", body = "") {
  const topicTokens = similarityTokens(topic, category.replace("#", ""));
  const bodyTokens = similarityTokens(body);
  const imageTokens = similarityTokens(image.alt, image.contextText, image.url);
  const sourceTokens = similarityTokens(image.sourceTitle);
  const sourceRelevance = Number(image.sourceRelevance || 0);
  const directScore = similarityScore(topicTokens, imageTokens).shared;
  const bodyScore = similarityScore(bodyTokens, imageTokens).shared;
  const sourceScore = similarityScore(topicTokens, sourceTokens).shared * 2;
  const hasUsefulAlt = String(image.alt || "").trim().length >= 3;
  const hasUsefulContext = String(image.contextText || "").trim().length >= 10;
  const hasSourceMatch = sourceScore > 0;

  if (sourceRelevance <= 0) return 0;
  if (!hasUsefulAlt && !hasUsefulContext && !hasSourceMatch) return 0;
  if (directScore === 0 && bodyScore < 2 && !hasSourceMatch) return 0;

  return directScore * 10 + bodyScore * 3 + sourceScore + sourceRelevance * 5 + (hasUsefulAlt ? 2 : 0);
}

function getImageCandidates(articles, topic = "", category = "", body = "") {
  return articles
    .flatMap((article) =>
      (article.images || []).map((image) => ({
        ...image,
        sourceTitle: article.title,
        sourceRelevance: sourceRelevanceScore(article, topic, category),
      }))
    )
    .filter((image) => !isRejectedImage(image.url, image.alt))
    .map((image) => ({
      ...image,
      score: scoreImageCandidate(image, topic, category, body),
    }))
    .filter((image) => image.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_IMAGE_CANDIDATES)
    .map((image, index) => ({ ...image, index }));
}

async function downloadPostImages(articles, slug, topic = "", category = "", body = "") {
  const downloaded = [];
  const candidates = getImageCandidates(articles, topic, category, body);
  const seen = new Set();
  console.log(
    `[agent] image candidates=${candidates.length} raw=${articles.reduce(
      (sum, article) => sum + (article.images?.length || 0),
      0
    )}`
  );

  await mkdir(IMAGES_DIR, { recursive: true });

  for (const image of candidates) {
    if (downloaded.length >= MAX_IMAGES_PER_POST) break;
    if (!image.url || seen.has(image.url)) continue;
    seen.add(image.url);

    try {
      const { bytes, contentType } = await httpGetBytes(image.url);
      const hash = createHash("sha1").update(bytes).digest("hex").slice(0, 8);
      const ext = imageExtension(contentType, image.url);
      const filename = `${slug}-${String(downloaded.length).padStart(2, "0")}-${hash}.${ext}`;
      await writeFile(path.join(IMAGES_DIR, filename), bytes);
      downloaded.push({
        index: image.index,
        alt: image.alt || "참고 이미지",
        contextText: image.contextText || "",
        sourceTitle: image.sourceTitle || "",
        sourceRelevance: image.sourceRelevance || 0,
        score: image.score || 0,
        path: `/images/posts/${filename}`,
        sourceUrl: image.sourceUrl,
      });
    } catch (error) {
      console.warn(`[warn] image download failed: ${image.url} (${error.message})`);
    }
  }

  console.log(`[agent] downloaded images=${downloaded.length}`);
  return downloaded;
}

async function cleanupDownloadedImages(images) {
  for (const image of images) {
    if (!image.path?.startsWith("/images/posts/")) continue;
    try {
      await unlink(path.join(IMAGES_DIR, path.basename(image.path)));
    } catch (error) {
      console.warn(`[warn] image cleanup failed: ${image.path} (${error.message})`);
    }
  }
}

function imageMarkdown(image, index) {
  const alt = image.alt.replace(/[[\]]/g, "").trim() || `참고 이미지 ${index + 1}`;
  const source = image.sourceUrl ? `\n\n<small>이미지 출처: ${image.sourceUrl}</small>` : "";
  return `![${alt}](${image.path})${source}`;
}

function imagePlacementScore(image, block, topic = "", category = "") {
  const imageTokens = relevanceTokens(image.alt, image.contextText, image.sourceTitle);
  const blockTokens = relevanceTokens(block);
  const topicTokens = relevanceTokens(topic, category.replace("#", ""));
  const blockImageShared = similarityScore(blockTokens, imageTokens).shared;
  const blockTopicShared = similarityScore(blockTokens, topicTokens).shared;
  const imageTopicShared = similarityScore(imageTokens, topicTokens).shared;
  const sourceRelevance = Number(image.sourceRelevance || 0);

  if (!imageTokens.size || !blockTokens.size || !topicTokens.size) return 0;
  if (sourceRelevance <= 0) return 0;
  if (blockImageShared < 1 || blockTopicShared < 1) return 0;

  return (
    blockImageShared * 8 +
    blockTopicShared * 3 +
    imageTopicShared * 4 +
    sourceRelevance * 2
  );
}

function canPlaceImageAfterBlock(block) {
  const text = String(block || "").trim();
  if (text.length < 80) return false;
  if (/^#/.test(text)) return false;
  if (/```/.test(text)) return false;
  if (/!\[[^\]]*\]\([^)]+\)/.test(text)) return false;
  if (text.includes("참고한 자료")) return false;
  return true;
}

function placeImagesInBody(markdownBody, images, topic = "", category = "") {
  const body = String(markdownBody || "")
    .replace(/\{\{IMAGE_\d+\}\}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!images.length) return { body, usedImages: [] };

  const blocks = body.split(/\n{2,}/);
  const placements = [];
  const usedBlockIndexes = new Set();
  const usedImages = new Set();

  for (const image of images) {
    let best = { blockIndex: -1, score: 0 };

    for (let blockIndex = 0; blockIndex < blocks.length; blockIndex += 1) {
      if (usedBlockIndexes.has(blockIndex)) continue;
      if (!canPlaceImageAfterBlock(blocks[blockIndex])) continue;

      const score = imagePlacementScore(image, blocks[blockIndex], topic, category);
      if (score > best.score) {
        best = { blockIndex, score };
      }
    }

    if (best.score >= MIN_IMAGE_PLACEMENT_SCORE) {
      placements.push({ image, blockIndex: best.blockIndex, score: best.score });
      usedBlockIndexes.add(best.blockIndex);
      usedImages.add(image.path);
    } else {
      console.log(
        `[agent] skipped image placement path=${image.path} score=${best.score} source=${image.sourceUrl || ""}`
      );
    }
  }

  if (!placements.length) return { body, usedImages: [] };

  placements.sort((a, b) => a.blockIndex - b.blockIndex);
  const byBlock = new Map(placements.map((placement) => [placement.blockIndex, placement]));
  const output = [];

  for (let index = 0; index < blocks.length; index += 1) {
    output.push(blocks[index]);
    const placement = byBlock.get(index);
    if (placement) {
      output.push(imageMarkdown(placement.image, output.length));
    }
  }

  return {
    body: output.join("\n\n").replace(/\n{3,}/g, "\n\n").trim(),
    usedImages: images.filter((image) => usedImages.has(image.path)),
  };
}

async function searchNaverBlog(keyword, maxResults = NAVER_SEARCH_RESULTS) {
  const url = `https://search.naver.com/search.naver?where=blog&query=${encodeURIComponent(
    keyword
  )}&sm=tab_opt&nso=so:r,p:1y`;
  const html = await httpGet(url);
  const $ = cheerio.load(html);
  const results = [];
  const seen = new Set();

  $("a[href*='blog.naver.com']").each((_, element) => {
    if (results.length >= maxResults) return false;
    const link = $(element).attr("href") || "";
    const title = $(element).text().trim();
    if (!link.includes("blog.naver.com") || seen.has(link)) return;
    if (!title || title.length < 4) return;

    seen.add(link);
    results.push({
      title,
      url: link,
      snippet: "",
      source: "naver",
    });
  });

  return results;
}

async function searchTistory(keyword, maxResults = TISTORY_SEARCH_RESULTS) {
  const url = `https://search.naver.com/search.naver?where=web&query=${encodeURIComponent(
    `${keyword} site:tistory.com`
  )}`;
  const html = await httpGet(url);
  const $ = cheerio.load(html);
  const results = [];
  const seen = new Set();

  $("a[href*='tistory.com']").each((_, element) => {
    if (results.length >= maxResults) return false;
    const link = $(element).attr("href") || "";
    const title = compactText($(element).text(), 120);
    if (!/https?:\/\/[^/]+\.tistory\.com\/.+/i.test(link) || seen.has(link)) return;
    if (!title || title.length < 4) return;

    seen.add(link);
    results.push({
      title,
      url: link,
      snippet: "",
      source: "tistory",
    });
  });

  return results;
}

async function searchVelog(keyword, maxResults = VELOG_SEARCH_RESULTS) {
  const query = `
    query SearchPosts($keyword: String!, $offset: Int, $limit: Int) {
      searchPosts(keyword: $keyword, offset: $offset, limit: $limit) {
        posts {
          title
          short_description
          url_slug
          user { username }
          released_at
        }
      }
    }
  `;

  const response = await fetch("https://v2.velog.io/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": UA,
    },
    body: JSON.stringify({
      query,
      variables: { keyword, offset: 0, limit: maxResults },
    }),
  });
  if (!response.ok) return [];
  const data = await response.json();
  const posts = data?.data?.searchPosts?.posts || [];

  return posts
    .filter((post) => post?.user?.username && post?.url_slug)
    .map((post) => ({
      title: post.title || "",
      url: `https://velog.io/@${post.user.username}/${post.url_slug}`,
      snippet: post.short_description || "",
      source: "velog",
    }));
}

async function searchSources(keyword) {
  const searches = [
    searchTistory(keyword, TISTORY_SEARCH_RESULTS),
    searchVelog(keyword, VELOG_SEARCH_RESULTS),
  ];

  if (NAVER_SEARCH_RESULTS > 0) {
    searches.push(searchNaverBlog(keyword, NAVER_SEARCH_RESULTS));
  }

  const [tistory, velog, naver] = await Promise.allSettled(searches);

  const combined = [
    ...(tistory.status === "fulfilled" ? tistory.value : []),
    ...(velog.status === "fulfilled" ? velog.value : []),
    ...(naver?.status === "fulfilled" ? naver.value : []),
  ];

  const seen = new Set();
  return combined.filter((item) => {
    if (!item.url || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function getReadableContainer($) {
  const selectors = [
    "div.se-main-container",
    "div.se_component_wrap",
    "article",
    "main",
    "div.entry-content",
    "div.post-content",
    "div.tt_article_useless_p_margin",
    "body",
  ];
  for (const selector of selectors) {
    const found = $(selector).first();
    if (found.length) return found;
  }
  return $("body").first();
}

async function fetchArticle(url) {
  let targetUrl = url;
  const naver = url.match(/blog\.naver\.com\/([^/]+)\/(\d+)/);
  if (naver) {
    targetUrl = `https://m.blog.naver.com/${naver[1]}/${naver[2]}`;
  }

  const html = await httpGet(targetUrl);
  const $ = cheerio.load(html);
  const container = getReadableContainer($);
  const title =
    $("meta[property='og:title']").attr("content") ||
    $("title").text() ||
    "Untitled";

  container.find("script, style, iframe, noscript").remove();
  const images = collectImageUrls($, container, targetUrl, url);
  const markdown = turndown.turndown(container.html() || "");
  const cleaned = markdown
    .replace(/\n{4,}/g, "\n\n")
    .replace(/\[[^\]]*\]\(#\)/g, "")
    .trim();

  return {
    title: title.replace(/\s*:\s*네이버 블로그\s*$/i, "").trim(),
    url,
    content_md: cleaned.slice(0, 5500),
    images,
  };
}

async function fetchSourceArticles(results, topic = "", category = "") {
  const articles = [];
  const fallbackArticles = [];
  for (const result of results) {
    if (articles.length >= MAX_SOURCE_ARTICLES) break;
    try {
      const article = { ...(await fetchArticle(result.url)), source: result.source };
      if (article.content_md.length > 500 && isSourceRelevant(article, topic, category)) {
        const hasImageCandidate = getImageCandidates([article], topic, category).length >= 1;
        if (hasImageCandidate) {
          articles.push(article);
        } else if (fallbackArticles.length < MAX_SOURCE_ARTICLES) {
          fallbackArticles.push(article);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    } catch (error) {
      console.warn(`[warn] fetch failed: ${result.url} (${error.message})`);
    }
  }
  return articles.length ? articles : fallbackArticles.slice(0, MAX_SOURCE_ARTICLES);
}

function extractJson(text) {
  const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("OpenAI response did not contain JSON");
    return JSON.parse(match[0]);
  }
}

async function synthesizePost({ topic, category, articles }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required");
  }

  const system = `너는 한국어 개발 블로그에 오류 해결 글을 쓰는 기술 에디터다.
반드시 참고 자료를 직접 복사하지 말고, 내용을 종합해서 새로운 글로 작성한다.
문체는 실무 개발자가 읽기 좋은 자연스러운 존댓말로 한다.
과장된 마케팅 문구는 피하고, 증상-원인-확인 명령어-해결 절차-재발 방지 흐름으로 정리한다.
응답은 JSON만 반환한다.`;

  const user = JSON.stringify(
    {
      task: "기존 GitHub 기술 블로그에 올릴 오류 해결형 새 글 작성",
      topic,
      requiredCategoryTag: category,
      outputSchema: {
        title: "오류명 또는 증상이 드러나는 SEO용 한국어 제목",
        description: "검색 결과에 들어갈 80~150자 요약",
        tags: ["#DevOps 같은 해시태그 3~6개"],
        markdownBody: "H1 제목 없이 Markdown 본문만 작성. 이미지 자리표시자는 작성하지 말 것",
      },
      writingRules: [
        "참고 글 문장을 길게 그대로 복사하지 말 것",
        "본문은 1800자 이상",
        "문제 증상, 대표 원인, 확인 명령어, 해결 절차, 흔한 실수, 재발 방지 체크리스트 포함",
        "명령어, 설정 파일, 로그, 에러 메시지, HTTP/API 요청, 실행 결과 예시는 반드시 적절한 언어의 fenced code block으로 작성",
        "이미지 자리표시자나 이미지 Markdown은 작성하지 말 것. 이미지는 스크립트가 별도로 검증해서 삽입한다.",
        "출처 링크 목록은 작성하지 말 것. 스크립트가 별도로 붙인다.",
      ],
      hardRequirements: [
        "markdownBody must be at least 2200 Korean characters before references.",
        "markdownBody must include at least 4 H2 sections using ## headings.",
        "Do not include an H1 heading in markdownBody.",
        "The first H2 section must explain the symptom or error message.",
        "At least one H2 section must explain causes and at least one H2 section must explain fixes.",
        "Include at least one realistic log, command, configuration, or terminal output code block.",
        "Do not include image placeholders such as {{IMAGE_0}}.",
        "Prefer practical operational examples, checklists, and failure cases over generic explanations.",
      ],
      references: articles.map((article) => ({
        title: article.title,
        url: article.url,
        excerpt: article.content_md,
      })),
    },
    null,
    2
  );

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      max_tokens: Number(process.env.LLM_MAX_TOKENS || 6500),
      temperature: Number(process.env.LLM_TEMPERATURE || 0.45),
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`OpenAI HTTP ${response.status}: ${details.slice(0, 500)}`);
  }

  const data = await response.json();
  recordOpenAiUsage(data.usage);
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned empty content");
  return extractJson(content);
}

function makeDescription(markdown) {
  return markdown
    .replace(/[#>*_`[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
}

function plainMarkdownText(markdown) {
  return String(markdown || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_`~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasRepeatedParagraph(markdown) {
  const seen = new Set();
  for (const block of String(markdown || "").split(/\n{2,}/)) {
    const normalized = normalizeForSimilarity(block);
    if (normalized.length < 80) continue;
    if (seen.has(normalized)) return true;
    seen.add(normalized);
  }
  return false;
}

function findLongCopiedSentence(body, articles) {
  const references = articles.map((article) => plainMarkdownText(article.content_md)).join(" ");
  const sentences = plainMarkdownText(body)
    .split(/[.!?。！？\n]/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 120);

  return sentences.find((sentence) => references.includes(sentence)) || "";
}

function hasTroubleshootingStructure(body) {
  const plain = plainMarkdownText(body);
  const hasSymptom = /증상|에러|오류|로그|메시지|실패|failed|error|exception|denied|refused|timeout|not found|bad gateway/i.test(
    plain
  );
  const hasCause = /원인|발생 이유|왜 발생|확인해야|점검|분석/i.test(plain);
  const hasFix = /해결|조치|수정|재시작|설정|복구|우회|적용/i.test(plain);
  const hasCodeBlock = /```[\s\S]+?```/.test(body);

  return hasSymptom && hasCause && hasFix && hasCodeBlock;
}

function ensureMinimumBodyLength(body, topic, category) {
  let next = String(body || "").trim();
  if (plainMarkdownText(next).length >= MIN_BODY_CHARS) return next;

  const additions = [
    `## 실무 적용 체크리스트

- ${topic}을 적용하기 전에 현재 운영 환경의 기준값과 예외 상황을 먼저 정리합니다.
- 변경 전후로 확인할 지표를 정하고, 문제가 생겼을 때 되돌릴 수 있는 절차를 문서화합니다.
- 한 번에 모든 서버나 서비스에 적용하기보다 작은 범위에서 검증한 뒤 점진적으로 확대합니다.
- 담당자, 확인 시간, 장애 판단 기준을 명확히 남겨 같은 문제가 반복될 때 빠르게 대응할 수 있게 합니다.`,
    `## 운영 중 자주 놓치는 부분

${category} 영역에서는 설정 자체보다 운영 중에 남는 기록과 점검 루틴이 더 중요합니다. 처음에는 정상처럼 보이더라도 트래픽이 늘거나 배포 주기가 빨라지면 작은 누락이 장애로 이어질 수 있습니다. 그래서 로그, 알림, 대시보드, 변경 이력을 함께 확인하고 실제 장애 대응 과정에서 필요한 정보가 빠지지 않았는지 주기적으로 점검해야 합니다.`,
  ];

  for (const addition of additions) {
    next = `${next}\n\n${addition}`.trim();
    if (plainMarkdownText(next).length >= MIN_BODY_CHARS) break;
  }

  return next;
}

function validateGeneratedPost({ topic, category, title, description, body, slug, posts, articles }) {
  const errors = [];
  const plain = plainMarkdownText(body);
  const h2Count = (body.match(/^##\s+/gm) || []).length;

  if (title.length < 12 || title.length > 90) errors.push("title length is out of range");
  if (description.length < 50 || description.length > 160) {
    errors.push("description length is out of range");
  }
  if (plain.length < MIN_BODY_CHARS) errors.push(`body is too short: ${plain.length}`);
  if (h2Count < MIN_H2_COUNT) errors.push(`not enough sections: ${h2Count}`);
  if (/^#\s+/m.test(body)) errors.push("body contains an H1 heading");
  if (hasRepeatedParagraph(body)) errors.push("body has repeated paragraphs");
  if (findLongCopiedSentence(body, articles)) errors.push("body appears to copy a source sentence");
  if (!hasTroubleshootingStructure(body)) {
    errors.push("body does not look like an error troubleshooting post");
  }
  if (findSimilarPost({ title, slug }, posts)) {
    errors.push("generated title is too similar to an existing post");
  }

  return errors;
}

function makeSearchKeyword(topic) {
  const normalized = String(topic || "").replace(/\s+/g, " ").trim();
  const suffix = /해결/.test(normalized) ? "원인" : "해결 원인";
  return `${normalized} ${suffix}`;
}

async function generatePost({ category, topic, posts, dryRun }) {
  const keyword = makeSearchKeyword(topic);

  console.log(`[agent] category=${category}`);
  console.log(`[agent] topic=${topic}`);
  console.log(`[agent] keyword=${keyword}`);

  const searchResults = await searchSources(keyword);
  console.log(`[agent] search results=${searchResults.length}`);
  const articles = await fetchSourceArticles(searchResults, topic, category);
  console.log(`[agent] fetched articles=${articles.length}`);

  const initialImageCandidates = getImageCandidates(articles, topic, category);
  console.log(`[agent] usable image candidates before generation=${initialImageCandidates.length}`);

  if (!articles.length) {
    console.warn(
      "[warn] skipped topic because no usable source article was fetched"
    );
    return null;
  }

  const generated = await synthesizePost({ topic, category, articles });
  const title = String(generated.title || `${topic} 실무 정리`).trim();
  const slug = slugify(title) || `agent-post-${todayIso()}`;
  const contentPath = path.join(POSTS_DIR, `${slug}.md`);

  if (posts.some((post) => post.slug === slug)) {
    console.log(`[agent] post already exists: ${slug}`);
    return null;
  }

  const similarPost = findSimilarPost({ topic, title, slug }, posts);
  if (similarPost) {
    console.log(`[agent] similar post already exists: ${similarPost.slug}`);
    return null;
  }

  const tags = [
    category,
    ...(Array.isArray(generated.tags) ? generated.tags.map(normalizeTag) : []),
  ];
  const uniqueTags = [...new Set(tags)].slice(0, 6);
  const body = ensureMinimumBodyLength(generated.markdownBody, topic, category);
  const description = String(generated.description || makeDescription(body)).trim().slice(0, 160);
  const qualityErrors = validateGeneratedPost({
    topic,
    category,
    title,
    description,
    body,
    slug,
    posts,
    articles,
  });
  if (qualityErrors.length) {
    console.warn(`[warn] skipped generated post by quality gate: ${qualityErrors.join("; ")}`);
    return null;
  }

  const downloadedImages = dryRun
    ? []
    : await downloadPostImages(articles, slug, topic, category, body);
  const { body: bodyWithImages, usedImages } = placeImagesInBody(
    body,
    downloadedImages,
    topic,
    category
  );
  const unusedImages = downloadedImages.filter(
    (image) => !usedImages.some((used) => used.path === image.path)
  );
  if (!dryRun && unusedImages.length) {
    await cleanupDownloadedImages(unusedImages);
  }
  console.log(`[agent] placed images=${usedImages.length}`);

  const sources = articles
    .map((article) => `- [${article.title.replace(/\]/g, "\\]")}](${article.url})`)
    .join("\n");
  const markdown = [
    `# ${title}`,
    "",
    "---",
    "",
    bodyWithImages,
    "",
    "---",
    "",
    "## 참고한 자료",
    "",
    sources,
    "",
  ].join("\n");

  const date = todayIso();
  const readingMinutes = Math.max(1, Math.ceil(markdown.split(/\s+/).length / 220));
  const metadata = {
    slug,
    title,
    description,
    date,
    tags: uniqueTags,
    coverGradient: "from-emerald-500 via-teal-500 to-blue-500",
    readingMinutes,
    contentPath: `/posts/${slug}.md`,
    generatedBy: "agent",
    sourceTopic: topic,
    imageCount: usedImages.length,
  };

  if (dryRun) {
    console.log("[agent] dry run generated post:");
    console.log(JSON.stringify(metadata, null, 2));
    return metadata;
  }

  await mkdir(POSTS_DIR, { recursive: true });
  await writeFile(contentPath, markdown, "utf8");
  console.log(`[agent] created ${contentPath}`);
  return metadata;
}

async function main() {
  const dryRun = process.env.AGENT_DRY_RUN === "true" || process.argv.includes("--dry-run");
  const postCount = getPostCount();
  const posts = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  const workingPosts = [...posts];
  const usedTopics = new Set();
  const maxAttempts = postCount * MAX_ATTEMPTS_PER_POST;
  let created = 0;
  let attemptsUsed = 0;

  console.log(`[agent] post count=${postCount}`);

  for (let attempt = 0; attempt < maxAttempts && created < postCount; attempt += 1) {
    attemptsUsed = attempt + 1;
    const category = chooseCategory(workingPosts, attempt);
    const topic = chooseTopic(category, workingPosts, usedTopics, attempt);
    usedTopics.add(topic);

    if (dryRun && !process.env.OPENAI_API_KEY) {
      console.log(`[agent] plan ${attempt + 1}/${maxAttempts}: ${category} - ${topic}`);
      continue;
    }

    const metadata = await generatePost({ category, topic, posts: workingPosts, dryRun });
    if (metadata) {
      workingPosts.unshift(metadata);
      created += 1;
    }

    if (attempt < maxAttempts - 1 && created < postCount) {
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
  }

  logOpenAiUsageSummary();
  await writeOpenAiUsageReport({
    dryRun,
    created,
    requested: postCount,
    attempts: attemptsUsed,
    maxAttempts,
  });

  if (dryRun) return;

  if (created === 0) {
    throw new Error(
      `Created 0/${postCount} posts after ${maxAttempts} attempts. Need more usable source articles or images.`
    );
  }

  if (created < postCount) {
    console.warn(
      `[warn] only created ${created}/${postCount} posts after ${maxAttempts} attempts; publishing partial result`
    );
  }

  workingPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  await writeFile(MANIFEST_PATH, `${JSON.stringify(workingPosts, null, 2)}\n`, "utf8");
  console.log(`[agent] finished created=${created} attempts=${maxAttempts}`);
}

main().catch(async (error) => {
  logOpenAiUsageSummary();
  await writeOpenAiUsageReport({ error: error.message }).catch((reportError) => {
    console.warn(`[warn] failed to write openai usage report: ${reportError.message}`);
  });
  console.error(error);
  process.exitCode = 1;
});
