import { Link } from "react-router-dom";
import { blogPaths } from "../routes/paths";
import { formatDate } from "./utils";

function EmptyState({ activeTag }) {
  return (
    <div className='rounded-2xl border border-dashed border-brand-border bg-brand-surface p-10 text-center text-brand-muted'>
      {activeTag
        ? `'${activeTag}' 태그로 등록된 글이 없습니다. 다른 태그를 선택해 보세요!`
        : "아직 등록된 글이 없습니다. 조금만 기다려 주세요!"}
    </div>
  );
}

export default function PostList({
  posts: providedPosts = [],
  title,
  activeTag,
  onTagClick,
}) {
  const handleTagClick = (event, tag) => {
    event.preventDefault();
    event.stopPropagation();
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  const sortedPosts = [...providedPosts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (!sortedPosts.length) {
    return <EmptyState activeTag={activeTag} />;
  }

  return (
    <div className='space-y-3'>
      {title ? (
        <h2 className='text-lg font-semibold text-brand-foreground'>{title}</h2>
      ) : null}
      {sortedPosts.map((post) => {
        const readingTime = post.readingMinutes ?? 1;
        return (
          <article
            key={post.slug}
            className='group overflow-hidden rounded-2xl border border-brand-border bg-brand-surface transition hover:border-brand-border-strong hover:shadow-md'>
            <Link
              to={blogPaths.detailOf(post.slug)}
              className='flex h-full flex-col gap-4 px-6 py-5 sm:px-8 sm:py-6'>
              <div className='flex flex-wrap items-center gap-2 text-xs text-brand-muted sm:text-sm'>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className='hidden text-brand-border-strong sm:inline'>•</span>
                <span>{`${readingTime}분 분량`}</span>
              </div>
              <div>
                <h2 className='text-xl font-semibold text-brand-foreground transition group-hover:text-brand-accent sm:text-2xl'>
                  {post.title}
                </h2>
                <p className='mt-2 text-sm leading-relaxed text-brand-muted sm:text-base'>
                  {post.description}
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                {post.tags?.map((tag) => {
                  const isActive = activeTag === tag;
                  return (
                    <button
                      key={tag}
                      type='button'
                      onClick={(event) => handleTagClick(event, tag)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        isActive
                          ? "bg-brand-accent text-white focus:ring-brand-accent-soft"
                          : "bg-brand-accent-soft text-brand-accent hover:bg-brand-border-strong"
                      }`}>
                      {tag}
                    </button>
                  );
                })}
              </div>
              <div className='mt-auto flex items-center justify-between text-xs text-brand-muted sm:text-sm'>
                <span>{`${readingTime}분 분량`}</span>
                <span className='inline-flex items-center gap-1 font-medium text-brand-accent'>
                  계속 읽기
                  <svg
                    aria-hidden='true'
                    className='h-3.5 w-3.5'
                    fill='none'
                    viewBox='0 0 12 12'>
                    <path
                      d='M4 2l4 4-4 4'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='1.5'
                    />
                  </svg>
                </span>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
