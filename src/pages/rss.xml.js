import { getPostImage, getPostUrl, sortPosts } from "../lib/posts.js";

const siteUrl = "https://choidz.github.io";
const postModules = import.meta.glob("../content/blog/*.md", { eager: true });

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function imageMimeType(image = "") {
  if (/\.png(?:$|\?)/i.test(image)) return "image/png";
  if (/\.webp(?:$|\?)/i.test(image)) return "image/webp";
  if (/\.gif(?:$|\?)/i.test(image)) return "image/gif";
  return "image/jpeg";
}

export async function GET() {
  const posts = sortPosts(Object.values(postModules))
    .filter((post) => !post.frontmatter.draft)
    .slice(0, 30);
  const latestDate = posts[0]?.frontmatter.date || new Date().toISOString();

  const items = posts
    .map((post) => {
      const url = new URL(getPostUrl(post.frontmatter.slug), siteUrl).toString();
      const image = getPostImage(post);
      const enclosure = image
        ? `<enclosure url="${escapeXml(new URL(image, siteUrl).toString())}" type="${imageMimeType(image)}" />`
        : "";

      return `
        <item>
          <title>${escapeXml(post.frontmatter.title)}</title>
          <link>${escapeXml(url)}</link>
          <guid isPermaLink="true">${escapeXml(url)}</guid>
          <description>${escapeXml(post.frontmatter.description)}</description>
          <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>
          ${enclosure}
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>최오키 개발블로그</title>
    <link>${siteUrl}</link>
    <description>개발, DevOps, 운영 경험을 실무 관점으로 정리하는 기술 블로그입니다.</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date(latestDate).toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
