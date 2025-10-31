import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { blogPaths } from "../routes/paths";
import posts from "./posts";
import {
  calculateReadingTime,
  formatDate,
  parseMarkdownTable,
  splitMarkdownContent,
} from "./utils";

const markdownComponents = {
  h2: ({ node, children, ...props }) => (
    <h2 className='mt-12 text-2xl font-semibold text-slate-900 first:mt-0' {...props}>
      {children}
    </h2>
  ),
  h3: ({ node, children, ...props }) => (
    <h3 className='mt-8 text-xl font-semibold text-slate-900' {...props}>
      {children}
    </h3>
  ),
  p: ({ node, children, ...props }) => (
    <p className='mt-4 leading-relaxed text-slate-700' {...props}>
      {children}
    </p>
  ),
  ul: ({ node, children, ...props }) => (
    <ul className='mt-4 list-disc space-y-2 pl-6 text-slate-700' {...props}>
      {children}
    </ul>
  ),
  ol: ({ node, children, ...props }) => (
    <ol className='mt-4 list-decimal space-y-2 pl-6 text-slate-700' {...props}>
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
      className='mt-6 border-l-4 border-indigo-200 bg-indigo-50/60 p-4 italic text-indigo-900'
      {...props}>
      {children}
    </blockquote>
  ),
  code({ node, inline, className, children, ...props }) {
    if (inline) {
      return (
        <code
          className='rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800'
          {...props}>
          {children}
        </code>
      );
    }
    return (
      <pre className='mt-6 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100'>
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
  if (!table.headers.length) {
    return null;
  }

  return (
    <div className='mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50'>
      <table className='min-w-full divide-y divide-slate-200 text-left text-sm'>
        <thead className='bg-white'>
          <tr>
            {table.headers.map((header, index) => (
              <th
                key={index}
                className='px-4 py-3 font-semibold uppercase tracking-wide text-slate-500'>
                <ReactMarkdown components={tableMarkdownComponents}>
                  {header}
                </ReactMarkdown>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-200 bg-white'>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className='hover:bg-slate-50'>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className='px-4 py-3 align-top text-slate-600'>
                  <ReactMarkdown components={tableMarkdownComponents}>
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
  const post = posts.find((item) => item.slug === slug);

  const [segments, setSegments] = useState([]);
  const [readingTime, setReadingTime] = useState(post?.readingMinutes ?? 1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!post) {
      return;
    }

    let cancelled = false;

    async function loadContent() {
      try {
        setIsLoading(true);
        const response = await fetch(post.contentPath);
        if (!response.ok) {
          throw new Error(`콘텐츠를 불러오지 못했습니다 (status ${response.status})`);
        }
        const markdown = await response.text();
        if (cancelled) {
          return;
        }
        setSegments(splitMarkdownContent(markdown));
        setReadingTime(calculateReadingTime(markdown));
        setIsLoading(false);
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message);
          setIsLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      cancelled = true;
    };
  }, [post]);

  if (!post) {
    return <Navigate to={blogPaths.home} replace />;
  }

  const gradient = post.coverGradient ?? "from-indigo-500 to-blue-500";

  return (
    <div className='min-h-screen bg-slate-100'>
      <div className='border-b border-slate-200 bg-white'>
        <div className='mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 sm:px-6'>
          <Link
            to={blogPaths.home}
            className='text-sm font-medium text-indigo-600 transition hover:text-indigo-700'>
            ← 글 목록으로 돌아가기
          </Link>
        </div>
      </div>
      <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12'>
        <div
          aria-hidden='true'
          className={`mb-8 h-48 w-full rounded-3xl bg-gradient-to-br ${gradient}`}
        />
        <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10'>
          <header className='flex flex-col gap-6'>
            <div className='flex flex-wrap items-center gap-3 text-xs text-slate-500 sm:text-sm'>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className='hidden text-slate-300 sm:inline'>•</span>
              <span>{`${readingTime}분 분량`}</span>
            </div>
            <div className='space-y-4'>
              <h1 className='text-3xl font-bold leading-tight text-slate-900 sm:text-4xl'>
                {post.title}
              </h1>
              <p className='text-base leading-relaxed text-slate-600 sm:text-lg'>
                {post.description}
              </p>
              <div className='flex flex-wrap gap-2'>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className='rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600'>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>
          <section className='mt-10 space-y-8'>
            {isLoading && !segments.length ? (
              <p className='text-sm text-slate-500'>콘텐츠를 불러오는 중입니다...</p>
            ) : null}
            {error ? (
              <p className='rounded-lg bg-rose-50 p-4 text-sm text-rose-600'>{error}</p>
            ) : null}
            {!error &&
              segments.map((segment, index) => {
                if (segment.type === "table") {
                  const table = parseMarkdownTable(segment.value);
                  return <MarkdownTable key={`table-${index}`} table={table} />;
                }

                return (
                  <ReactMarkdown
                    key={`md-${index}`}
                    components={markdownComponents}>
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
