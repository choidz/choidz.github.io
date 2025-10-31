import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { blogPaths, portfolioPath } from "../routes/paths";
import PostList from "./post-list";
import posts from "./posts";
import { formatDate } from "./utils";

const primaryLinks = [
  { label: "블로그", path: blogPaths.home, isPrimary: true },
  { label: "포트폴리오", path: portfolioPath, isPrimary: false },
];

function SiteHeader() {
  return (
    <header className='border-b border-slate-200 bg-white'>
      <div className='mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6'>
        <Link
          to={blogPaths.home}
          className='inline-flex items-center gap-2 text-xl font-bold text-slate-900'>
          <span className='hidden sm:inline text-slate-600'>Tech Notes</span>
        </Link>
        <div className='hidden w-full max-w-md md:block'>
          <label className='relative block'>
            <span className='sr-only'>검색</span>
            <input
              className='w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200'
              placeholder='키워드로 글을 검색해 보세요'
              type='search'
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
        <nav className='flex items-center gap-2 text-sm font-medium text-slate-600'>
          {primaryLinks.map(({ label, path, isPrimary }) => (
            <Link
              key={label}
              to={path}
              className={`inline-flex items-center rounded-full px-4 py-1.5 transition ${
                isPrimary
                  ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                  : "border border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              }`}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function FeaturedPost({ post, activeTag, onTagClick }) {
  if (!post) {
    return null;
  }

  const readingTime = post.readingMinutes ?? 1;
  const gradient = post.coverGradient ?? "from-indigo-500 to-blue-500";

  const handleTagClick = (event, tag) => {
    event.preventDefault();
    event.stopPropagation();
    onTagClick?.(tag);
  };

  return (
    <article className='group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-lg'>
      <Link to={blogPaths.detailOf(post.slug)} className='flex h-full flex-col'>
        <div
          aria-hidden='true'
          className={`h-48 w-full bg-gradient-to-br ${gradient} opacity-90 transition duration-300 group-hover:opacity-100`}
        />
        <div className='flex flex-1 flex-col gap-5 px-8 py-8'>
          <div className='flex flex-wrap items-center gap-3 text-sm text-slate-500'>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className='hidden text-slate-300 sm:inline'>•</span>
            <span>{`${readingTime}분 분량`}</span>
          </div>
          <div className='space-y-3'>
            <h1 className='text-3xl font-bold leading-tight text-slate-900 transition group-hover:text-indigo-600 sm:text-4xl'>
              {post.title}
            </h1>
            <p className='text-base leading-relaxed text-slate-600 sm:text-lg'>
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
                      ? "bg-indigo-600 text-white focus:ring-indigo-300"
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  }`}>
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </Link>
    </article>
  );
}

function LatestStack({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <section className='rounded-2xl border border-slate-200 bg-white'>
      <div className='border-b border-slate-100 px-5 py-4'>
        <h2 className='text-sm font-semibold uppercase tracking-widest text-slate-500'>
          최신 등록 글
        </h2>
      </div>
      <ol className='space-y-4 px-5 py-5'>
        {items.map((post, index) => (
          <li key={post.slug} className='flex items-start gap-3'>
            <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500'>
              {index + 1}
            </span>
            <div className='space-y-1'>
              <Link
                to={blogPaths.detailOf(post.slug)}
                className='text-sm font-semibold text-slate-800 transition hover:text-indigo-600'>
                {post.title}
              </Link>
              <p className='text-xs text-slate-500'>{formatDate(post.date)}</p>
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
    <section className='rounded-2xl border border-slate-200 bg-white'>
      <div className='border-b border-slate-100 px-5 py-4'>
        <h2 className='text-sm font-semibold uppercase tracking-widest text-slate-500'>
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
              ? "bg-indigo-600 text-white focus:ring-indigo-300"
              : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
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
                  ? "bg-indigo-600 text-white focus:ring-indigo-300"
                  : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}>
              {tag}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function CommunityCard() {
  return (
    <section className='rounded-2xl border border-indigo-100 bg-indigo-50/70 p-6 text-slate-800'>
      <h2 className='text-lg font-semibold text-slate-900'>
        개발자로서의 여정을 기록하고 있어요
      </h2>
      <p className='mt-3 text-sm leading-relaxed text-slate-600'>
        최신 글은 블로그에서, 프로젝트 히스토리는 포트폴리오에서 확인해 주세요.
        꾸준히 업데이트하며 성장 과정을 공유합니다.
      </p>
      <div className='mt-4 flex flex-wrap gap-3'>
        <Link
          to={blogPaths.home}
          className='inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700'>
          블로그 최신 글 보기
        </Link>
        <Link
          to={portfolioPath}
          className='inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm transition hover:bg-indigo-50'>
          포트폴리오 열람
        </Link>
      </div>
    </section>
  );
}

export default function BlogLayout() {
  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)),
    []
  );

  const [activeTag, setActiveTag] = useState(null);

  const filteredPosts = useMemo(() => {
    if (!activeTag) {
      return sortedPosts;
    }
    return sortedPosts.filter((post) => post.tags?.includes(activeTag));
  }, [sortedPosts, activeTag]);

  const featuredPost = filteredPosts[0];
  const listPosts = filteredPosts.slice(1);
  const trendingPosts = filteredPosts.slice(0, 4);
  const uniqueTags = useMemo(
    () => Array.from(new Set(sortedPosts.flatMap((post) => post.tags ?? []))),
    [sortedPosts]
  );

  const handleTagClick = (tag) => {
    setActiveTag((current) => (current === tag ? null : tag));
  };

  return (
    <div className='min-h-screen bg-slate-100 text-slate-900'>
      <SiteHeader />
      <main className='mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
          <div className='space-y-6'>
            <FeaturedPost
              post={featuredPost}
              activeTag={activeTag}
              onTagClick={handleTagClick}
            />
            <PostList
              posts={listPosts}
              title={
                activeTag
                  ? `${activeTag} 태그 글`
                  : featuredPost
                  ? "최신 글"
                  : "모든 글"
              }
              activeTag={activeTag}
              onTagClick={handleTagClick}
            />
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
      </main>
    </div>
  );
}
