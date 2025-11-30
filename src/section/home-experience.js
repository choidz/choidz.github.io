import React from "react";
import { EXPERIENCE } from "../data/portfolio";

export default function HomeExperience() {
  return (
    <section className="my-24 space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-500">
          Experience
        </p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">
          제품과 팀의 상황에 맞춰 빠르게 적응했습니다.
        </h2>
      </div>
      <div className="space-y-6">
        {EXPERIENCE.map((exp) => (
          <article
            key={`${exp.company}-${exp.period}`}
            className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {exp.period}
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {exp.role}
                </h3>
                <p className="text-sm font-medium text-slate-600">{exp.company}</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold text-slate-600">
                Product · Web · UI
              </span>
            </div>
            <p className="mt-4 text-base text-slate-600">{exp.summary}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {exp.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
