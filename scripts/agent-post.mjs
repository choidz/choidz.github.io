import * as cheerio from "cheerio";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import TurndownService from "turndown";

const SITE_URL = "https://choidz.github.io";
const POSTS_DIR = path.join(process.cwd(), "public", "posts");
const IMAGES_DIR = path.join(process.cwd(), "public", "images", "posts");
const MANIFEST_PATH = path.join(POSTS_DIR, "index.json");
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const DEFAULT_POST_COUNT = 2;
const MAX_POST_COUNT = 2;
const MAX_IMAGES_PER_POST = 2;
const MIN_IMAGES_PER_POST = 2;
const MAX_IMAGE_CANDIDATES = 16;
const MIN_SOURCE_ARTICLES = 3;
const MIN_BODY_CHARS = 1600;
const MIN_H2_COUNT = 3;
const NAVER_SEARCH_RESULTS = 30;
const VELOG_SEARCH_RESULTS = 10;
const MAX_SOURCE_ARTICLES = 10;
const MAX_ATTEMPTS_PER_POST = 8;
const REJECT_IMAGE_PATTERN =
  /advert|advertise|ads?|banner|logo|profile|avatar|emoji|icon|comment|sponsor|promo|coupon|qr|placeholder|spinner|loading|blank|sprite/i;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

const TOPIC_BANK = {
  "#DevOps": [
    "Kubernetes 배포 전략",
    "Docker 이미지 최적화",
    "CI/CD 파이프라인 장애 대응",
    "RabbitMQ 운영 장애 패턴",
    "Kafka Consumer Lag 모니터링",
    "Blue Green 배포 체크리스트",
    "무중단 배포 롤백 전략",
    "GitHub Actions 배포 자동화",
    "컨테이너 로그 수집 전략",
    "운영 환경 장애 회고 작성법",
    "서비스 헬스체크 설계",
    "배포 전 체크리스트 자동화",
  ],
  "#Linux": [
    "Linux 로그 분석 명령어",
    "Linux 파일 권한 실무",
    "systemd 서비스 운영",
    "서버 디스크 사용량 점검",
    "Linux 네트워크 문제 추적",
    "Linux 프로세스 점검 방법",
    "crontab 운영 실수 방지",
    "SSH 접속 장애 해결",
    "서버 부하 평균 해석",
    "로그 로테이션 설정",
  ],
  "#ElasticSearch": [
    "Elasticsearch 인덱스 설계",
    "Elasticsearch JVM 메모리 튜닝",
    "Kibana 운영 대시보드",
    "Elasticsearch slow query 분석",
    "Elasticsearch 샤드 운영",
    "Elasticsearch 매핑 설계",
    "Elasticsearch 클러스터 상태 점검",
    "Kibana Discover 실무 활용",
  ],
  "#Grafana": [
    "Grafana 대시보드 설계",
    "Grafana 알림 규칙 운영",
    "Prometheus Grafana 연동",
    "Grafana 변수 템플릿 활용",
    "Grafana 패널 구성 원칙",
    "운영 지표 시각화 기준",
  ],
  "#Zabbix": [
    "Zabbix 알림 튜닝",
    "Zabbix Agent 운영",
    "Zabbix 모니터링 항목 설계",
    "Zabbix 템플릿 관리",
    "Zabbix 장애 알림 피로도 줄이기",
    "Zabbix와 Grafana 연동 운영",
  ],
  "#Frontend": [
    "React 상태 관리 패턴",
    "Next.js 정적 사이트 SEO",
    "프론트엔드 성능 최적화",
    "Astro 블로그 SEO",
    "Markdown 기반 콘텐츠 관리",
    "웹 접근성 기본 점검",
  ],
  "#Other": [
    "개발자 문서화 습관",
    "Git 커밋 메시지 전략",
    "개발 생산성 도구 자동화",
    "개발 블로그 글감 관리",
    "기술 문서 리뷰 방법",
    "개인 프로젝트 릴리즈 노트",
    "작업 로그를 지식 자산으로 바꾸기",
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

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function dayOfYear() {
  const now = new Date();
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
  const directScore = similarityScore(topicTokens, imageTokens).shared;
  const bodyScore = similarityScore(bodyTokens, imageTokens).shared;
  const sourceScore = similarityScore(topicTokens, sourceTokens).shared * 2;
  const hasUsefulAlt = String(image.alt || "").trim().length >= 3;
  const hasUsefulContext = String(image.contextText || "").trim().length >= 10;
  const hasSourceMatch = sourceScore > 0;

  if (!hasUsefulAlt && !hasUsefulContext) return 0;
  if (directScore === 0 && bodyScore < 2 && !hasSourceMatch) return 0;

  return directScore * 10 + bodyScore * 3 + sourceScore + (hasUsefulAlt ? 2 : 0);
}

function getImageCandidates(articles, topic = "", category = "", body = "") {
  return articles
    .flatMap((article) =>
      (article.images || []).map((image) => ({
        ...image,
        sourceTitle: article.title,
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

function placeImagesInBody(markdownBody, images) {
  let body = markdownBody;
  let used = 0;
  const imageByIndex = new Map(images.map((image) => [image.index, image]));

  for (let index = 0; index < MAX_IMAGES_PER_POST; index += 1) {
    const placeholder = `{{IMAGE_${index}}}`;
    const image = imageByIndex.get(index);
    if (body.includes(placeholder) && image) {
      body = body.replace(placeholder, imageMarkdown(image, index));
      used += 1;
    }
  }

  body = body.replace(/\{\{IMAGE_\d+\}\}/g, "").replace(/\n{3,}/g, "\n\n").trim();
  if (used || !images.length) return body;

  const blocks = body.split(/\n{2,}/);
  const output = [];
  let inserted = 0;

  for (let i = 0; i < blocks.length; i += 1) {
    output.push(blocks[i]);
    const next = blocks[i + 1] || "";
    const currentLooksUseful =
      /^##\s+/.test(blocks[i]) ||
      (!/^#/.test(blocks[i]) && blocks[i].length > 120 && !blocks[i].startsWith("```"));
    const nextIsNotHeading = !/^##\s+/.test(next);

    if (
      inserted < images.length &&
      i > 1 &&
      currentLooksUseful &&
      nextIsNotHeading &&
      !blocks[i].includes("참고한 자료")
    ) {
      output.push(imageMarkdown(images[inserted], inserted));
      inserted += 1;
      i += 1;
      if (i < blocks.length) output.push(blocks[i]);
    }
  }

  while (inserted < images.length && output.length > 3) {
    const insertAt = Math.max(2, output.length - 2);
    output.splice(insertAt, 0, imageMarkdown(images[inserted], inserted));
    inserted += 1;
  }

  return output.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
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
  const [naver, velog] = await Promise.allSettled([
    searchNaverBlog(keyword, NAVER_SEARCH_RESULTS),
    searchVelog(keyword, VELOG_SEARCH_RESULTS),
  ]);

  const combined = [
    ...(naver.status === "fulfilled" ? naver.value : []),
    ...(velog.status === "fulfilled" ? velog.value : []),
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

async function fetchSourceArticles(results) {
  const articles = [];
  for (const result of results) {
    if (articles.length >= MAX_SOURCE_ARTICLES) break;
    try {
      const article = await fetchArticle(result.url);
      if (article.content_md.length > 500) {
        articles.push(article);
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    } catch (error) {
      console.warn(`[warn] fetch failed: ${result.url} (${error.message})`);
    }
  }
  return articles;
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
  const imageCandidates = getImageCandidates(articles, topic, category);

  const system = `너는 한국어 개발 블로그 글을 쓰는 기술 에디터다.
반드시 참고 자료를 직접 복사하지 말고, 내용을 종합해서 새로운 글로 작성한다.
문체는 실무 개발자가 읽기 좋은 자연스러운 존댓말로 한다.
과장된 마케팅 문구는 피하고, 개념-상황-실무 체크포인트-마무리 흐름으로 정리한다.
응답은 JSON만 반환한다.`;

  const user = JSON.stringify(
    {
      task: "기존 GitHub 기술 블로그에 올릴 새 글 작성",
      topic,
      requiredCategoryTag: category,
      outputSchema: {
        title: "SEO에 적합한 한국어 제목",
        description: "검색 결과에 들어갈 80~150자 요약",
        tags: ["#DevOps 같은 해시태그 3~6개"],
        markdownBody: "H1 제목 없이 Markdown 본문만 작성. 이미지가 어울리는 단락 사이에 {{IMAGE_0}}, {{IMAGE_1}} 자리표시자를 선택적으로 배치",
      },
      writingRules: [
        "참고 글 문장을 길게 그대로 복사하지 말 것",
        "본문은 1800자 이상",
        "실무 예시, 체크리스트, 흔한 실수, 마무리 요약 포함",
        "코드가 필요할 때만 fenced code block 사용",
        "이미지 자리표시자는 글의 흐름상 관련 있는 문단 뒤에만 넣고, 본문 맨 위에는 넣지 말 것",
        "이미지가 내용과 직접 관련 없으면 자리표시자를 쓰지 말 것",
        "출처 링크 목록은 작성하지 말 것. 스크립트가 별도로 붙인다.",
      ],
      hardRequirements: [
        "markdownBody must be at least 2200 Korean characters before references.",
        "markdownBody must include at least 4 H2 sections using ## headings.",
        "Do not include an H1 heading in markdownBody.",
        "Use both {{IMAGE_0}} and {{IMAGE_1}} only where the surrounding paragraph is directly relevant to the image.",
        "Prefer practical operational examples, checklists, and failure cases over generic explanations.",
      ],
      references: articles.map((article) => ({
        title: article.title,
        url: article.url,
        excerpt: article.content_md,
      })),
      imageCandidates: imageCandidates.map((image, index) => ({
        placeholder: `{{IMAGE_${image.index}}}`,
        alt: image.alt || "참고 이미지",
        imageUrl: image.url,
        sourceTitle: image.sourceTitle,
        sourceUrl: image.sourceUrl,
      })),
      imageRules: [
        "{{IMAGE_0}} 또는 {{IMAGE_1}} 형식만 사용",
        "이미지 설명 alt나 참고 글 제목과 맞는 문맥에만 배치",
        "같은 자리표시자를 두 번 쓰지 말 것",
      ],
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
      max_tokens: Number(process.env.LLM_MAX_TOKENS || 8000),
      temperature: Number(process.env.LLM_TEMPERATURE || 0.45),
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`OpenAI HTTP ${response.status}: ${details.slice(0, 500)}`);
  }

  const data = await response.json();
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
  if (/\{\{IMAGE_\d+\}\}/.test(body) && !getImageCandidates(articles, topic, category, body).length) {
    errors.push("body contains image placeholders but no image candidates exist");
  }
  if (hasRepeatedParagraph(body)) errors.push("body has repeated paragraphs");
  if (findLongCopiedSentence(body, articles)) errors.push("body appears to copy a source sentence");
  if (findSimilarPost({ title, slug }, posts)) {
    errors.push("generated title is too similar to an existing post");
  }

  return errors;
}

async function generatePost({ category, topic, posts, dryRun }) {
  const keyword = `${topic} ${category.replace("#", "")} 실무`;

  console.log(`[agent] category=${category}`);
  console.log(`[agent] topic=${topic}`);
  console.log(`[agent] keyword=${keyword}`);

  const searchResults = await searchSources(keyword);
  console.log(`[agent] search results=${searchResults.length}`);
  const articles = await fetchSourceArticles(searchResults);
  console.log(`[agent] fetched articles=${articles.length}`);

  if (articles.length < MIN_SOURCE_ARTICLES) {
    console.warn(
      `[warn] skipped topic because source articles are insufficient: ${articles.length}/${MIN_SOURCE_ARTICLES}`
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
  const body = String(generated.markdownBody || "").trim();
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
  if (!dryRun && downloadedImages.length < MIN_IMAGES_PER_POST) {
    await cleanupDownloadedImages(downloadedImages);
    console.warn(
      `[warn] skipped generated post because it only has ${downloadedImages.length}/${MIN_IMAGES_PER_POST} images`
    );
    return null;
  }

  const bodyWithImages = placeImagesInBody(body, downloadedImages);
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
    imageCount: downloadedImages.length,
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

  console.log(`[agent] post count=${postCount}`);

  for (let attempt = 0; attempt < maxAttempts && created < postCount; attempt += 1) {
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

  if (dryRun) return;

  if (created < postCount) {
    throw new Error(
      `Only created ${created}/${postCount} posts after ${maxAttempts} attempts. Need more usable source articles or images.`
    );
  }

  workingPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  await writeFile(MANIFEST_PATH, `${JSON.stringify(workingPosts, null, 2)}\n`, "utf8");
  console.log(`[agent] finished created=${created} attempts=${maxAttempts}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
