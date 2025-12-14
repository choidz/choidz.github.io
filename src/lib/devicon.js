const DEVICON_BASE_URL = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const OVERRIDE_SLUGS = {
  vue: "vuejs",
  "vue.js": "vuejs",
  "vue-js": "vuejs",
  "c#": "csharp",
  csharp: "csharp",
  "c++": "cplusplus",
  cpp: "cplusplus",
  cplusplus: "cplusplus",
  "f#": "fsharp",
  fsharp: "fsharp",
  "node.js": "nodejs",
  node: "nodejs",
  nodejs: "nodejs",
  "next.js": "nextjs",
  next: "nextjs",
  nextjs: "nextjs",
  "nuxt.js": "nuxtjs",
  nuxt: "nuxtjs",
  nuxtjs: "nuxtjs",
  tailwind: "tailwindcss",
  "tailwind css": "tailwindcss",
  extjs: "extjs",
  mssql: "microsoftsqlserver",
  "sql (mssql)": "microsoftsqlserver",
  mysql: "mysql",
  oracle: "oracle",
  firebase: "firebase",
  svn: "subversion",
  "git / github / github desktop": "git",
  git: "git",
  eclipse: "eclipse",
  "vs code": "vscode",
  vscode: "vscode",
  slack: "slack",
  notion: "notion",
  confluence: "confluence",
  photoshop: "photoshop",
  illustrator: "illustrator",
  spring: "spring",
  mybatis: "java",
  "react.js": "react",
  react: "react",
  flutter: "flutter",
  android: "android",
  sqlite: "sqlite",
  html: "html5",
  css: "css3",
};

const sanitizeTag = (tag) =>
  tag
    .trim()
    .toLowerCase()
    .replace(/\+\+/g, "plusplus")
    .replace(/#/g, "sharp")
    .replace(/\./g, "")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

export const getDeviconSlug = (tag) => {
  if (!tag) return null;
  const trimmed = tag.trim().toLowerCase();
  if (OVERRIDE_SLUGS[trimmed]) {
    return OVERRIDE_SLUGS[trimmed];
  }
  const sanitized = sanitizeTag(tag);
  return sanitized || null;
};

export const buildDeviconUrl = (slug, variant = "original") =>
  `${DEVICON_BASE_URL}/${slug}/${slug}-${variant}.svg`;

export const FALLBACK_VARIANTS = ["original", "plain", "line"];
