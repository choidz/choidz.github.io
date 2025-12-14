import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { blogPaths, portfolioPath } from "../routes/paths";
import PostList from "./post-list";
import usePosts from "./usePosts";
import { getPostViewsMap } from "./usePostViews";
import { formatDate } from "./utils";

const primaryLinks = [
  { label: "블로그", path: blogPaths.home, isPrimary: true },
  // { label: "포트폴리오", path: portfolioPath, isPrimary: false }, // 포트폴리오 수정 중 - 임시 숨김
];

function SiteHeader({ searchQuery, onSearchChange }) {
  return (
    <header className='border-b border-brand-border bg-brand-surface'>
      <div className='mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6'>
        <Link
          to={blogPaths.home}
          className='inline-flex items-center gap-2 text-xl font-bold text-brand-foreground'>
          <span className='hidden text-brand-muted sm:inline'>Tech Notes</span>
        </Link>
        <div className='hidden w-full max-w-md md:block'>
          <label className='relative block'>
            <span className='sr-only'>검색</span>
            <input
              className='w-full rounded-full border border-brand-border bg-brand-background py-2 pl-10 pr-4 text-sm text-brand-foreground placeholder:text-brand-muted focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent-soft'
              placeholder='키워드로 글을 검색해 보세요'
              type='search'
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <svg
              aria-hidden='true'
              className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400'
              fill='none'
              viewBox='0 0 16 16'>
              <path
                d='M11.25 11.25L14 14'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='1.5'
              />
              <circle
                cx='7.5'
                cy='7.5'
                r='4.75'
                stroke='currentColor'
                strokeWidth='1.5'
              />
            </svg>
          </label>
        </div>
        <nav className='flex items-center gap-2 text-sm font-medium text-brand-muted'>
          {primaryLinks.map(({ label, path, isPrimary }) => (
            <Link
              key={label}
              to={path}
              className={`inline-flex items-center rounded-full px-4 py-1.5 transition ${
                isPrimary
                  ? "bg-brand-accent text-white shadow-sm hover:bg-brand-accent-hover"
                  : "border border-brand-border text-brand-muted hover:border-brand-border-strong hover:bg-brand-accent-soft hover:text-brand-accent"
              }`}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function LatestStack({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <section className='rounded-2xl border border-brand-border bg-brand-surface'>
      <div className='border-b border-brand-border px-5 py-4'>
        <h2 className='text-sm font-semibold uppercase tracking-widest text-brand-muted'>
          최신 등록 글
        </h2>
      </div>
      <ol className='space-y-4 px-5 py-5'>
        {items.map((post, index) => (
          <li key={post.slug} className='flex items-start gap-3'>
            <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent-soft text-xs font-semibold text-brand-muted'>
              {index + 1}
            </span>
            <div className='space-y-1'>
              <Link
                to={blogPaths.detailOf(post.slug)}
                className='text-sm font-semibold text-brand-foreground transition hover:text-brand-accent'>
                {post.title}
              </Link>
              <p className='text-xs text-brand-muted'>{formatDate(post.date)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function TagSuggestions({ tags, activeTag, onTagClick }) {
  if (!tags?.length) {
    return null;
  }

  const handleClick = (tag) => {
    onTagClick?.(tag);
  };

  return (
    <section className='rounded-2xl border border-brand-border bg-brand-surface'>
      <div className='border-b border-brand-border px-5 py-4'>
        <h2 className='text-sm font-semibold uppercase tracking-widest text-brand-muted'>
          태그
        </h2>
      </div>
      <div className='flex flex-wrap gap-2 px-5 py-5'>
        <button
          type='button'
          onClick={() => handleClick(null)}
          aria-pressed={!activeTag}
          className={`rounded-full px-3 py-1 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            !activeTag
              ? "bg-brand-accent text-white focus:ring-brand-accent-soft"
              : "bg-brand-background text-brand-muted hover:bg-brand-accent-soft hover:text-brand-accent"
          }`}>
          전체
        </button>
        {tags.map((tag) => {
          const isActive = activeTag === tag;
          return (
            <button
              key={tag}
              type='button'
              onClick={() => handleClick(tag)}
              aria-pressed={isActive}
              className={`rounded-full px-3 py-1 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                isActive
                  ? "bg-brand-accent text-white focus:ring-brand-accent-soft"
                  : "bg-brand-background text-brand-muted hover:bg-brand-accent-soft hover:text-brand-accent"
              }`}>
              {tag}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <nav className='flex items-center justify-center gap-2' aria-label='페이지네이션'>
      <button
        type='button'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border bg-brand-surface text-brand-foreground transition hover:bg-brand-accent-soft hover:text-brand-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-brand-surface disabled:hover:text-brand-foreground'
        aria-label='이전 페이지'>
        <svg
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 19l-7-7 7-7'
          />
        </svg>
      </button>

      {startPage > 1 && (
        <>
          <button
            type='button'
            onClick={() => onPageChange(1)}
            className='inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border bg-brand-surface text-sm font-medium text-brand-foreground transition hover:bg-brand-accent-soft hover:text-brand-accent'>
            1
          </button>
          {startPage > 2 && (
            <span className='text-brand-muted'>...</span>
          )}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          type='button'
          onClick={() => onPageChange(page)}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition ${
            currentPage === page
              ? 'border-brand-accent bg-brand-accent text-white'
              : 'border-brand-border bg-brand-surface text-brand-foreground hover:bg-brand-accent-soft hover:text-brand-accent'
          }`}
          aria-current={currentPage === page ? 'page' : undefined}>
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className='text-brand-muted'>...</span>
          )}
          <button
            type='button'
            onClick={() => onPageChange(totalPages)}
            className='inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border bg-brand-surface text-sm font-medium text-brand-foreground transition hover:bg-brand-accent-soft hover:text-brand-accent'>
            {totalPages}
          </button>
        </>
      )}

      <button
        type='button'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border bg-brand-surface text-brand-foreground transition hover:bg-brand-accent-soft hover:text-brand-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-brand-surface disabled:hover:text-brand-foreground'
        aria-label='다음 페이지'>
        <svg
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 5l7 7-7 7'
          />
        </svg>
      </button>
    </nav>
  );
}

function CommunityCard() {
  return (
    <section className='rounded-2xl border border-brand-border-strong bg-brand-accent-soft/60 p-6 text-brand-foreground'>
      <h2 className='text-lg font-semibold text-brand-foreground'>
        개발자로서의 여정을 기록하고 있어요
      </h2>
      <p className='mt-3 text-sm leading-relaxed text-brand-muted'>
        최신 글은 블로그에서 확인해 주세요.
        꾸준히 업데이트하며 성장 과정을 공유합니다.
      </p>
      <div className='mt-4 flex flex-wrap gap-3'>
        <Link
          to={blogPaths.home}
          className='inline-flex items-center rounded-full bg-brand-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-accent-hover'>
          블로그 최신 글 보기
        </Link>
        {/* 포트폴리오 수정 중 - 임시 숨김
        <Link
          to={portfolioPath}
          className='inline-flex items-center rounded-full bg-brand-surface px-4 py-2 text-sm font-medium text-brand-accent shadow-sm transition hover:bg-brand-accent-soft'>
          포트폴리오 열람
        </Link>
        */}
      </div>
    </section>
  );
}

export default function BlogLayout() {
  const { posts, isLoading, error } = usePosts();
  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [posts]
  );

  const [activeTag, setActiveTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewsMap, setViewsMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const postsPerPage = 10;

  useEffect(() => {
    if (posts.length === 0) return;

    async function fetchViews() {
      const slugs = posts.map((post) => post.slug);
      const views = await getPostViewsMap(slugs);
      setViewsMap(views);
    }

    fetchViews();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = sortedPosts;

    // 태그 필터링
    if (activeTag) {
      result = result.filter((post) => post.tags?.includes(activeTag));
    }

    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((post) => {
        const titleMatch = post.title?.toLowerCase().includes(query);
        const descMatch = post.description?.toLowerCase().includes(query);
        const tagMatch = post.tags?.some((tag) => tag.toLowerCase().includes(query));
        return titleMatch || descMatch || tagMatch;
      });
    }

    return result;
  }, [sortedPosts, activeTag, searchQuery]);

  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const trendingPosts = filteredPosts.slice(0, 4);
  const uniqueTags = useMemo(
    () => Array.from(new Set(sortedPosts.flatMap((post) => post.tags ?? []))),
    [sortedPosts]
  );

  const handleTagClick = (tag) => {
    setActiveTag((current) => (current === tag ? null : tag));
    setCurrentPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className='min-h-screen bg-brand-background text-brand-foreground'>
      <SiteHeader searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      <main className='mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10'>
        {isLoading ? (
          <p className='text-sm text-brand-muted'>게시글을 불러오는 중입니다…</p>
        ) : error ? (
          <p className='rounded-lg bg-rose-50 p-4 text-sm text-rose-600'>
            {error}
          </p>
        ) : !filteredPosts.length ? (
          <div className='rounded-2xl border border-dashed border-brand-border bg-brand-surface p-10 text-center text-brand-muted'>
            {searchQuery.trim()
              ? `"${searchQuery}" 검색 결과가 없습니다.`
              : '게시글이 없습니다. 새로운 글을 작성해 주세요.'}
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
            <div className='space-y-6'>
              <PostList
                posts={currentPosts}
                title={
                  searchQuery.trim()
                    ? `"${searchQuery}" 검색 결과 (${totalPosts}건)`
                    : activeTag
                    ? `${activeTag} 태그 글`
                    : '모든 글'
                }
                activeTag={activeTag}
                onTagClick={handleTagClick}
                viewsMap={viewsMap}
              />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
            <aside className='space-y-6'>
              <LatestStack items={trendingPosts} />
              <TagSuggestions
                tags={uniqueTags}
                activeTag={activeTag}
                onTagClick={handleTagClick}
              />
              <CommunityCard />
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
