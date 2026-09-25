const CATEGORY_RULES = [
  ["AI", ["ai", "openai", "chatgpt", "llm", "rag", "langchain", "ollama", "gemini", "anthropic", "mcp", "embedding"]],
  ["Mobile", ["mobile", "android", "flutter", "react native", "expo", "ios", "cocoapods"]],
  ["Database", ["database", "mysql", "postgresql", "postgres", "redis", "jdbc", "dbeaver", "supabase", "prisma", "drizzle", "pgvector", "sql"]],
  ["Frontend", ["frontend", "react", "next.js", "nextjs", "vite", "npm", "zustand", "tailwind", "shadcn", "웹 접근성"]],
  ["Programming", ["programming", "java", "javascript", "typescript", "c#", ".net", "node.js", "spring boot", "python", "fastapi", "pydantic"]],
  ["ElasticSearch", ["elasticsearch", "kibana"]],
  ["Grafana", ["grafana", "prometheus"]],
  ["Zabbix", ["zabbix"]],
  ["Linux", ["linux", "리눅스", "systemctl", "ssh", "chmod", "chown", "vim", "crontab", "logrotate"]],
  ["DevOps", ["devops", "docker", "kubernetes", "jenkins", "github actions", "ci/cd", "git", "nginx", "ansible", "kafka", "rabbitmq", "배포", "컨테이너"]],
];

const ERROR_TAGS = new Set(["error", "errorhandling", "오류해결", "troubleshooting"]);

function normalize(value) {
  return String(value ?? "").replace(/^#/, "").trim().toLowerCase();
}

export function getPostCategories(post) {
  const frontmatter = post?.frontmatter ?? post ?? {};
  const tags = (frontmatter.tags ?? []).map(normalize).filter(Boolean);
  const searchable = `${tags.join(" ")} ${frontmatter.title ?? ""} ${frontmatter.description ?? ""}`.toLowerCase();
  const tokens = new Set(searchable.split(/[^\p{L}\p{N}#+.]+/u).filter(Boolean));
  const categories = CATEGORY_RULES
    .filter(([, keywords]) => keywords.some((keyword) => keyword.length <= 3 ? tokens.has(keyword) : searchable.includes(keyword)))
    .map(([category]) => category);

  if (tags.some((tag) => ERROR_TAGS.has(tag))) categories.push("Error");
  return [...new Set(categories)];
}

export function getCategorySummary(posts) {
  const counts = new Map(CATEGORY_RULES.map(([category]) => [category, 0]));
  counts.set("Error", 0);

  for (const post of posts) {
    for (const category of getPostCategories(post)) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }

  const order = ["DevOps", "Linux", "Database", "Programming", "Frontend", "AI", "Mobile", "Error", "ElasticSearch", "Grafana", "Zabbix"];
  return order.map((category) => [category, counts.get(category) ?? 0]).filter(([, count]) => count > 0);
}
