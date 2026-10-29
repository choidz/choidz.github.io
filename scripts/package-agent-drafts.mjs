import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const postsDir = path.join(root, "public", "posts");
const imagesDir = path.join(root, "public", "images", "posts");
const outputDir = path.join(root, "review-drafts");

const usage = JSON.parse(
  await readFile(path.join(root, ".agent-usage", "latest.json"), "utf8")
);
const createdSlugs = usage.createdSlugs ?? [];

if (Number(usage.created || 0) !== createdSlugs.length) {
  throw new Error("Draft count and created slugs do not match");
}

if (createdSlugs.length === 0) {
  console.log("[drafts] no new drafts to package");
} else {
  const manifest = JSON.parse(
    await readFile(path.join(postsDir, "index.json"), "utf8")
  );
  const drafts = createdSlugs.map((slug) => {
    const post = manifest.find((entry) => entry.slug === slug);
    if (!post) throw new Error(`Draft is missing from manifest: ${slug}`);
    return post;
  });

  await mkdir(path.join(outputDir, "posts"), { recursive: true });
  await mkdir(path.join(outputDir, "images", "posts"), { recursive: true });

  for (const post of drafts) {
    const filename = `${post.slug}.md`;
    const markdown = await readFile(path.join(postsDir, filename), "utf8");
    await writeFile(path.join(outputDir, "posts", filename), markdown, "utf8");

    const imagePaths = new Set(
      [...markdown.matchAll(/!\[[^\]]*\]\((\/images\/posts\/[^)\s]+)\)/g)]
        .map((match) => path.basename(decodeURIComponent(match[1])))
    );
    for (const image of imagePaths) {
      await copyFile(
        path.join(imagesDir, image),
        path.join(outputDir, "images", "posts", image)
      );
    }
  }

  await writeFile(
    path.join(outputDir, "index.json"),
    `${JSON.stringify(drafts, null, 2)}\n`,
    "utf8"
  );
  await writeFile(
    path.join(outputDir, "README.txt"),
    "Review the drafts and images. Only add approved posts to public/posts/index.json and public/posts/, then commit to master to publish.\n",
    "utf8"
  );
  console.log(`[drafts] packaged ${drafts.length} draft(s) for review`);
}
