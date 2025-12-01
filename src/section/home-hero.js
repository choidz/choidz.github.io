import React from "react";
import { HERO_CONTENT } from "../data/portfolio";

export default function HomeHero() {
  const { badge, title, description, highlights, ctas, stats, location, profileImage } =
    HERO_CONTENT;

  const buttonClass = (variant) =>
    variant === "primary"
      ? "bg-emerald-600 text-white hover:bg-emerald-700"
      : "border border-slate-300 text-slate-700 hover:border-emerald-300 hover:text-emerald-600";

  return (
    <section className="mt-16 rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-1">
      <div className="grid gap-12 rounded-[28px] bg-white/90 p-10 shadow-xl md:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold text-slate-600">
            {badge}
          </p>
          <h1 className="text-4xl font-black leading-tight text-slate-900 md:text-5xl">
            {title}
          </h1>
          <p className="text-lg leading-relaxed text-slate-600">{description}</p>
          <ul className="space-y-2 text-base text-slate-700">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4">
            {ctas.map((cta) => (
              <a
                key={cta.label}
                href={cta.href}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${buttonClass(
                  cta.variant
                )}`}
              >
                {cta.label}
              </a>
            ))}
          </div>
          <div className="grid gap-4 border-t border-slate-100 pt-6 text-sm text-slate-500 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p>{stat.label}</p>
              </div>
            ))}
            <div>
              <p className="text-2xl font-bold text-slate-900">📍</p>
              <p>{location}</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-emerald-100 blur-3xl" />
          <div className="relative rounded-3xl border border-slate-100 bg-white/70 p-6 text-center shadow-lg">
            <img
              className="mx-auto h-72 w-72 rounded-full object-cover ring-8 ring-white"
              src={profileImage}
              alt="최성현 프로필"
            />
            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Focus
            </p>
            <p className="text-lg font-semibold text-slate-900">
              Frontend Engineering & Product Experience
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
