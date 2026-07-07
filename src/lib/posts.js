export function sortPosts(posts) {
  return [...posts].sort((a, b) => {
    const dateDiff = new Date(b.frontmatter.date) - new Date(a.frontmatter.date);
    if (dateDiff !== 0) return dateDiff;

    return (a.frontmatter.order ?? 999999) - (b.frontmatter.order ?? 999999);
  });
}

export function getAllTags(posts) {
  return [
    ...new Set(
      posts.flatMap((post) => post.frontmatter.tags ?? []).filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b, "ko"));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function getPostUrl(slug) {
  return `/blog/${slug}`;
}

export function getPostRaw(post) {
  if (typeof post.rawContent === "function") return post.rawContent();
  return post.rawContent ?? post.body ?? "";
}

export function getPostImage(post) {
  const raw = getPostRaw(post);
  const localImage = raw.match(/!\[[^\]]*\]\((\/images\/posts\/[^)\s]+)\)/);
  return post.frontmatter.image ?? localImage?.[1] ?? "";
}

export function getRelatedPosts(currentPost, posts, limit = 3) {
  const currentSlug = currentPost.frontmatter.slug;
  const currentTags = new Set(currentPost.frontmatter.tags ?? []);

  return posts
    .filter((post) => post.frontmatter.slug !== currentSlug)
    .map((post) => {
      const sharedTags = (post.frontmatter.tags ?? []).filter((tag) => currentTags.has(tag));
      return { post, score: sharedTags.length };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.frontmatter.date) - new Date(a.post.frontmatter.date))
    .slice(0, limit)
    .map((item) => item.post);
}
