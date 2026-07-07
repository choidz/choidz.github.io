import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "public", "posts", "index.json");
const usagePath = path.join(root, "public", "agent-usage", "latest.json");
const postsDir = path.join(root, "public", "posts");
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const MIN_IMAGES_PER_POST = 2;

const ERROR_PATTERN =
  /오류|에러|해결|문제|실패|원인|failed|failure|error|exception|denied|refused|timeout|not found|crash|down|red|pending|enoent|cors|oom|memory|permission/i;

function todayIsoKst() {
  return new Date(Date.now() + KST_OFFSET_MS).toISOString().slice(0, 10);
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

function findEmptySections(markdown) {
  const sections = String(markdown || "").split(/^##\s+/gm).slice(1);
  return sections
    .map((section) => {
      const [title = "", ...rest] = section.split(/\r?\n/);
      const body = plainMarkdownText(rest.join("\n"));
      return { title: title.trim(), body };
    })
    .filter((section) => section.title && section.body.length < 40)
    .map((section) => section.title);
}

function validatePost(post, markdown, knownSlugs) {
  const errors = [];
  const plain = plainMarkdownText(markdown);
  const h2Count = (markdown.match(/^##\s+/gm) || []).length;
  const localImages = markdown.match(/!\[[^\]]*\]\(\/images\/posts\/[^)\s]+\)/g) || [];

  if (!ERROR_PATTERN.test(`${post.title} ${post.description} ${post.sourceTopic || ""}`)) {
    errors.push("title/description does not look like an error-solving post");
  }
  if (plain.length < 1400) errors.push(`body is too short: ${plain.length}`);
  if (h2Count < 3) errors.push(`not enough H2 sections: ${h2Count}`);
  if (!/```[\s\S]+?```/.test(markdown)) errors.push("missing fenced code block");
  if (/^#\s+/m.test(markdown.replace(/^#\s+.+\r?\n/, ""))) {
    errors.push("body contains an extra H1 heading");
  }
  if (/^---\s*$/m.test(markdown)) errors.push("contains standalone horizontal rule");
  if (/!\[[^\]]*\]\(https?:\/\//i.test(markdown)) errors.push("contains external hotlinked image");
  if (localImages.length < MIN_IMAGES_PER_POST) {
    errors.push(`not enough local images: ${localImages.length}/${MIN_IMAGES_PER_POST}`);
  }

  const emptySections = findEmptySections(markdown);
  if (emptySections.length) {
    errors.push(`empty or too-short sections: ${emptySections.join(", ")}`);
  }

  const duplicateCount = knownSlugs.filter((slug) => slug === post.slug).length;
  if (duplicateCount > 1) errors.push(`duplicate slug: ${post.slug}`);

  if (Number(post.imageCount || 0) !== localImages.length) {
    errors.push(`imageCount mismatch: metadata=${post.imageCount || 0}, markdown=${localImages.length}`);
  }

  return errors;
}

async function main() {
  const today = process.env.AGENT_VALIDATE_DATE || todayIsoKst();
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const usage = JSON.parse(await readFile(usagePath, "utf8").catch(() => "{}"));
  const knownSlugs = manifest.map((post) => post.slug);
  const createdSlugs = Array.isArray(usage.createdSlugs) ? usage.createdSlugs : [];
  const targets = createdSlugs.length
    ? manifest.filter((post) => createdSlugs.includes(post.slug))
    : manifest.filter((post) => post.generatedBy === "agent" && post.date === today);

  if (!targets.length) {
    throw new Error(`No generated agent posts found for ${today}`);
  }

  const failures = [];
  for (const post of targets) {
    const markdown = await readFile(path.join(postsDir, `${post.slug}.md`), "utf8");
    const errors = validatePost(post, markdown, knownSlugs);
    if (errors.length) failures.push({ slug: post.slug, errors });
  }

  if (failures.length) {
    for (const failure of failures) {
      console.error(`[agent-validate] ${failure.slug}: ${failure.errors.join("; ")}`);
    }
    throw new Error(`Agent post quality validation failed for ${failures.length}/${targets.length} posts`);
  }

  console.log(`[agent-validate] passed ${targets.length} generated post(s) for ${today}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
