import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "public", "posts", "index.json");
const sourceDir = path.join(root, "public", "posts");
const outputDir = path.join(root, "src", "content", "blog");

function frontmatterString(value) {
  return JSON.stringify(value ?? "");
}

function normalizeTags(tags) {
  return Array.isArray(tags)
    ? tags.map((tag) => String(tag).replace(/^#/, "")).filter(Boolean)
    : [];
}

function stripLeadingTitle(markdown) {
  return markdown.replace(/^\s*#\s+.+(?:\r?\n)+/, "").trimStart();
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  for (const [index, post] of manifest.entries()) {
    const sourcePath = path.join(sourceDir, `${post.slug}.md`);
    const rawMarkdown = await readFile(sourcePath, "utf8");
    const body = stripLeadingTitle(rawMarkdown);
    const tags = normalizeTags(post.tags);

    const frontmatter = [
      "---",
      `slug: ${frontmatterString(post.slug)}`,
      `title: ${frontmatterString(post.title)}`,
      `description: ${frontmatterString(post.description)}`,
      `date: ${frontmatterString(post.date)}`,
      `order: ${Number(post.order ?? index)}`,
      `tags: ${JSON.stringify(tags)}`,
      ...(post.image ? [`image: ${frontmatterString(post.image)}`] : []),
      `readingMinutes: ${Number(post.readingMinutes ?? 1)}`,
      `draft: false`,
      "---",
      "",
    ].join("\n");

    await writeFile(
      path.join(outputDir, `${post.slug}.md`),
      `${frontmatter}${body}\n`,
      "utf8"
    );
  }

  console.log(`Synced ${manifest.length} posts to ${path.relative(root, outputDir)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
