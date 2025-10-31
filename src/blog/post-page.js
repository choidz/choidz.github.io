import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, Navigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { blogPaths } from "../routes/paths";
import usePosts from "./usePosts";
import {
  calculateReadingTime,
  formatDate,
  parseMarkdownTable,
  splitMarkdownContent,
} from "./utils";

const markdownComponents = {
  h2: ({ node, children, ...props }) => (
    <h2
      className='mt-12 text-2xl font-semibold text-brand-foreground first:mt-0'
      {...props}>
      {children}
    </h2>
  ),
  h3: ({ node, children, ...props }) => (
    <h3 className='mt-8 text-xl font-semibold text-brand-foreground' {...props}>
      {children}
    </h3>
  ),
  p: ({ node, children, ...props }) => (
    <p className='mt-4 leading-relaxed text-brand-muted' {...props}>
      {children}
    </p>
  ),
  ul: ({ node, children, ...props }) => (
    <ul className='mt-4 list-disc space-y-2 pl-6 text-brand-muted' {...props}>
      {children}
    </ul>
  ),
  ol: ({ node, children, ...props }) => (
    <ol className='mt-4 list-decimal space-y-2 pl-6 text-brand-muted' {...props}>
      {children}
    </ol>
  ),
  li: ({ node, children, ...props }) => (
    <li className='leading-relaxed' {...props}>
      {children}
    </li>
  ),
  blockquote: ({ node, children, ...props }) => (
    <blockquote
      className='mt-6 border-l-4 border-brand-border-strong bg-brand-accent-soft/60 p-4 italic text-brand-foreground'
      {...props}>
      {children}
    </blockquote>
  ),
  code({ node, inline, className, children, ...props }) {
    if (inline) {
      return (
        <code
          className='rounded bg-brand-accent-soft px-1.5 py-0.5 font-mono text-sm text-brand-foreground'
          {...props}>
          {children}
        </code>
      );
    }
    return (
      <pre className='mt-6 overflow-x-auto rounded-xl bg-brand-foreground p-4 text-sm text-brand-background'>
        <code {...props}>{children}</code>
      </pre>
    );
  },
};

const tableMarkdownComponents = {
  ...markdownComponents,
  p: ({ children }) => <>{children}</>,
};

function MarkdownTable({ table }) {
  if (!table.headers.length) return null;

  return (
    <div className='mt-8 overflow-x-auto rounded-2xl border border-brand-border bg-brand-background'>
      <table className='min-w-full divide-y divide-brand-border text-left text-sm'>
        <thead className='bg-brand-surface'>
          <tr>
            {table.headers.map((header, index) => (
              <th
                key={index}
                className='px-4 py-3 font-semibold uppercase tracking-wide text-brand-muted'>
                <ReactMarkdown
                  components={tableMarkdownComponents}
                  remarkPlugins={[remarkGfm]}>
                  {header}
                </ReactMarkdown>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-brand-border bg-brand-surface'>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className='hover:bg-brand-accent-soft/40'>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className='px-4 py-3 align-top text-brand-muted'>
                  <ReactMarkdown
                    components={tableMarkdownComponents}
                    remarkPlugins={[remarkGfm]}>
                    {cell || ""}
                  </ReactMarkdown>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PostPage() {
  const { slug } = useParams();
  const { posts, isLoading, error } = usePosts();
  const post = useMemo(
    () => posts.find((item) => item.slug === slug),
    [posts, slug]
  );

  const [segments, setSegments] = useState([]);
  const [readingTime, setReadingTime] = useState(post?.readingMinutes ?? 1);
  const [contentError, setContentError] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    if (!post) return;

    let cancelled = false;

    async function loadContent() {
      try {
        setContentLoading(true);
        const response = await fetch(post.contentPath);
        if (!response.ok) {
          throw new Error(
            `콘텐츠를 불러오지 못했습니다 (status ${response.status})`
          );
        }
        const markdown = await response.text();
        if (cancelled) return;

        setSegments(splitMarkdownContent(markdown));
        setReadingTime(calculateReadingTime(markdown));
        setContentLoading(false);
      } catch (fetchError) {
        if (!cancelled) {
          setContentError(fetchError.message);
          setContentLoading(false);
        }
      }
    }

    loadContent();
    return () => {
      cancelled = true;
    };
  }, [post]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-brand-background'>
        <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12'>
          <p className='text-sm text-brand-muted'>
            게시글 정보를 불러오는 중입니다…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-brand-background'>
        <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12'>
          <p className='rounded-lg bg-rose-50 p-4 text-sm text-rose-600'>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return <Navigate to={blogPaths.home} replace />;
  }

  return (
    <div className='min-h-screen bg-brand-background'>
      <div className='border-b border-brand-border bg-brand-surface'>
        <div className='mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 sm:px-6'>
          <Link
            to={blogPaths.home}
            className='text-sm font-medium text-brand-accent transition hover:text-brand-accent-hover'>
            ← 글 목록으로 돌아가기
          </Link>
        </div>
      </div>

      <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12'>
        <article className='rounded-3xl border border-brand-border bg-brand-surface p-6 shadow-sm sm:p-10'>
          <header className='flex flex-col gap-6'>
            <div className='flex flex-wrap items-center gap-3 text-xs text-brand-muted sm:text-sm'>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className='hidden text-brand-border-strong sm:inline'>•</span>
              <span>{`${readingTime}분 분량`}</span>
            </div>

            <div className='space-y-4'>
              <h1 className='text-3xl font-bold leading-tight text-brand-foreground sm:text-4xl'>
                {post.title}
              </h1>
              <p className='text-base leading-relaxed text-brand-muted sm:text-lg'>
                {post.description}
              </p>
              <div className='flex flex-wrap gap-2'>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className='rounded-full bg-brand-accent-soft px-3 py-1 text-xs font-medium text-brand-accent'>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>

          <section className='mt-10 space-y-8'>
            {contentLoading && !segments.length ? (
              <p className='text-sm text-brand-muted'>
                콘텐츠를 불러오는 중입니다...
              </p>
            ) : null}

            {contentError ? (
              <p className='rounded-lg bg-rose-50 p-4 text-sm text-rose-600'>
                {contentError}
              </p>
            ) : null}

            {!contentError &&
              segments.map((segment, index) => {
                if (segment.type === "table") {
                  const table = parseMarkdownTable(segment.value);
                  return <MarkdownTable key={`table-${index}`} table={table} />;
                }

                return (
                  <ReactMarkdown
                    key={`md-${index}`}
                    components={markdownComponents}
                    remarkPlugins={[remarkGfm]}>
                    {segment.value.trim()}
                  </ReactMarkdown>
                );
              })}
          </section>
        </article>
      </div>
    </div>
  );
}
