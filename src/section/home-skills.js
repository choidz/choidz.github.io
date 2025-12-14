import React, { useState } from "react";
import { SKILL_STACKS } from "../data/portfolio";
import { getDeviconSlug, buildDeviconUrl, FALLBACK_VARIANTS } from "../lib/devicon";

function SkillIcon({ name }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const slug = getDeviconSlug(name);

  if (!slug) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-xs font-bold text-slate-500">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  const handleError = () => {
    if (variantIndex < FALLBACK_VARIANTS.length - 1) {
      setVariantIndex((prev) => prev + 1);
    }
  };

  return (
    <img
      src={buildDeviconUrl(slug, FALLBACK_VARIANTS[variantIndex])}
      alt={name}
      className="h-8 w-8 rounded-lg object-contain"
      loading="lazy"
      onError={handleError}
    />
  );
}

function HomeSkills() {
  return (
    <section className="mt-24 space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-500">
          기술스택
        </p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">
          제품 개발 전 과정을 커버하는 도구들
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          언어, 프레임워크, 데이터베이스부터 협업 도구까지 역할에 맞춰 선택합니다.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {SKILL_STACKS.map((stack) => (
          <div
            key={stack.title}
            className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">{stack.title}</h3>
            <ul className="mt-4 space-y-3">
              {stack.skills.map((skill) => (
                <li
                  key={`${stack.title}-${skill.name}`}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  <SkillIcon name={skill.name} />
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HomeSkills;
