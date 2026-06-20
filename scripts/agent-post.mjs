import * as cheerio from "cheerio";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import TurndownService from "turndown";

const SITE_URL = "https://choidz.github.io";
const POSTS_DIR = path.join(process.cwd(), "public", "posts");
const MANIFEST_PATH = path.join(POSTS_DIR, "index.json");
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
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
  ],
  "#Linux": [
    "Linux 로그 분석 명령어",
    "Linux 파일 권한 실무",
    "systemd 서비스 운영",
    "서버 디스크 사용량 점검",
    "Linux 네트워크 문제 추적",
  ],
  "#ElasticSearch": [
    "Elasticsearch 인덱스 설계",
    "Elasticsearch JVM 메모리 튜닝",
    "Kibana 운영 대시보드",
    "Elasticsearch slow query 분석",
  ],
  "#Grafana": [
    "Grafana 대시보드 설계",
    "Grafana 알림 규칙 운영",
    "Prometheus Grafana 연동",
  ],
  "#Zabbix": [
    "Zabbix 알림 튜닝",
    "Zabbix Agent 운영",
    "Zabbix 모니터링 항목 설계",
  ],
  "#Frontend": [
    "React 상태 관리 패턴",
    "Next.js 정적 사이트 SEO",
    "프론트엔드 성능 최적화",
  ],
  "#Other": [
    "개발자 문서화 습관",
    "Git 커밋 메시지 전략",
    "개발 생산성 도구 자동화",
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

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function dayOfYear() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
  return Math.floor((now - start) / 86400000);
}

function chooseCategory(posts) {
  const requested = normalizeTag(process.env.AGENT_CATEGORY || "");
  if (TOPIC_BANK[requested]) return requested;

  const counts = new Map();
  for (const post of posts) {
    for (const tag of post.tags || []) {
      const normalized = normalizeTag(tag);
      if (TOPIC_BANK[normalized]) {
        counts.set(normalized, (counts.get(normalized) || 0) + 1);
      }
    }
  }

  const weighted = [];
  for (const [tag, topics] of Object.entries(TOPIC_BANK)) {
    const count = counts.get(tag) || 1;
    for (let i = 0; i < Math.max(1, Math.min(count, 8)); i += 1) {
      weighted.push(tag);
    }
    if (topics.length && !counts.has(tag)) weighted.push(tag);
  }

  return weighted[dayOfYear() % weighted.length] || "#DevOps";
}

function chooseTopic(category, posts) {
  const requested = (process.env.AGENT_TOPIC || "").trim();
  if (requested) return requested;

  const existingTitles = new Set(posts.map((post) => post.title));
  const topics = TOPIC_BANK[category] || TOPIC_BANK["#DevOps"];
  const offset = dayOfYear() % topics.length;

  for (let i = 0; i < topics.length; i += 1) {
    const topic = topics[(offset + i) % topics.length];
    if (![...existingTitles].some((title) => title.includes(topic))) {
      return topic;
    }
  }

  return `${topics[offset]} 실무 정리`;
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

async function searchNaverBlog(keyword, maxResults = 6) {
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

async function searchVelog(keyword, maxResults = 4) {
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
    searchNaverBlog(keyword, 6),
    searchVelog(keyword, 4),
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
  const markdown = turndown.turndown(container.html() || "");
  const cleaned = markdown
    .replace(/\n{4,}/g, "\n\n")
    .replace(/\[[^\]]*\]\(#\)/g, "")
    .trim();

  return {
    title: title.replace(/\s*:\s*네이버 블로그\s*$/i, "").trim(),
    url,
    content_md: cleaned.slice(0, 5500),
  };
}

async function fetchSourceArticles(results) {
  const articles = [];
  for (const result of results) {
    if (articles.length >= 4) break;
    try {
      const article = await fetchArticle(result.url);
      if (article.content_md.length > 500) {
        articles.push(article);
      }
      await new Promise((resolve) => setTimeout(resolve, 400));
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
        markdownBody: "H1 제목 없이 Markdown 본문만 작성",
      },
      writingRules: [
        "참고 글 문장을 길게 그대로 복사하지 말 것",
        "본문은 1800자 이상",
        "실무 예시, 체크리스트, 흔한 실수, 마무리 요약 포함",
        "코드가 필요할 때만 fenced code block 사용",
        "출처 링크 목록은 작성하지 말 것. 스크립트가 별도로 붙인다.",
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
      max_tokens: Number(process.env.LLM_MAX_TOKENS || 6000),
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

async function main() {
  const dryRun = process.env.AGENT_DRY_RUN === "true" || process.argv.includes("--dry-run");
  const posts = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  const category = chooseCategory(posts);
  const topic = chooseTopic(category, posts);
  const keyword = `${topic} ${category.replace("#", "")} 실무`;

  console.log(`[agent] category=${category}`);
  console.log(`[agent] topic=${topic}`);
  console.log(`[agent] keyword=${keyword}`);

  if (dryRun && !process.env.OPENAI_API_KEY) {
    console.log("[agent] dry run without OPENAI_API_KEY: plan only");
    return;
  }

  const searchResults = await searchSources(keyword);
  console.log(`[agent] search results=${searchResults.length}`);
  const articles = await fetchSourceArticles(searchResults);
  console.log(`[agent] fetched articles=${articles.length}`);

  if (articles.length < 2) {
    throw new Error("Not enough source articles to synthesize a reliable post");
  }

  const generated = await synthesizePost({ topic, category, articles });
  const title = String(generated.title || `${topic} 실무 정리`).trim();
  const slug = slugify(title) || `agent-post-${todayIso()}`;
  const contentPath = path.join(POSTS_DIR, `${slug}.md`);

  if (posts.some((post) => post.slug === slug)) {
    console.log(`[agent] post already exists: ${slug}`);
    return;
  }

  const tags = [
    category,
    ...(Array.isArray(generated.tags) ? generated.tags.map(normalizeTag) : []),
  ];
  const uniqueTags = [...new Set(tags)].slice(0, 6);
  const body = String(generated.markdownBody || "").trim();
  const sources = articles
    .map((article) => `- [${article.title.replace(/\]/g, "\\]")}](${article.url})`)
    .join("\n");
  const markdown = [
    `# ${title}`,
    "",
    "---",
    "",
    body,
    "",
    "---",
    "",
    "## 참고한 자료",
    "",
    sources,
    "",
  ].join("\n");

  const date = todayIso();
  const description = String(generated.description || makeDescription(body)).trim().slice(0, 160);
  const readingMinutes = Math.max(1, Math.ceil(markdown.split(/\s+/).length / 220));

  if (dryRun) {
    console.log("[agent] dry run generated post:");
    console.log(JSON.stringify({ slug, title, description, date, tags: uniqueTags }, null, 2));
    return;
  }

  await writeFile(contentPath, markdown, "utf8");
  posts.unshift({
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
  });
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  await writeFile(MANIFEST_PATH, `${JSON.stringify(posts, null, 2)}\n`, "utf8");

  console.log(`[agent] created ${contentPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
