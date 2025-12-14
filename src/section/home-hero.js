import React from "react";
import { HERO_CONTENT } from "../data/portfolio";

export default function HomeHero() {
  const { badge, title, description, ctas, location, profileImage } = HERO_CONTENT;

  return (
    <section className="mt-16 flex flex-col items-center text-center">
      <img
        className="h-32 w-32 rounded-full object-cover ring-4 ring-slate-100"
        src={profileImage}
        alt="최성현 프로필"
      />
      <p className="mt-6 text-sm font-medium text-slate-500">{badge}</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
        {description}
      </p>
      <p className="mt-3 text-sm text-slate-400">{location}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {ctas.map((cta) => (
          <a
            key={cta.label}
            href={cta.href}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition ${
              cta.variant === "primary"
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            {cta.label}
          </a>
        ))}
      </div>
    </section>
  );
}
