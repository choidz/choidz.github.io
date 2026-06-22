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
