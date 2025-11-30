import React from "react";
import { TagBadge } from "./tags";

export default function ProjectCard({ project }) {
  const {
    title,
    description,
    impact,
    image,
    period,
    tags,
    links = [],
    context,
  } = project;

  return (
    <article className="group grid gap-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:grid-cols-[300px,1fr]">
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/5">
        <img
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
          src={image}
          alt={`${title} 대표 이미지`}
          loading="lazy"
        />
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          {period}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
              Featured Project
            </p>
            {context && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {context}
              </span>
            )}
          </div>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">{title}</h3>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            {description}
          </p>
          {impact && (
            <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {impact}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagBadge key={`${project.slug}-${tag}`} label={tag} />
          ))}
        </div>
        {links.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {links.map((link) => (
              <a
                key={`${project.slug}-${link.label}`}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:text-emerald-600"
              >
                {link.icon && (
                  <img
                    src={link.icon}
                    alt={link.label}
                    className="h-5 w-5"
                    loading="lazy"
                  />
                )}
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
