import React from "react";

const VALUES = [
  {
    title: "데이터 우선 설계",
    description:
      "비즈니스 규칙을 스키마·프로시저에 녹여두고, 프런트/백엔드 구현은 그 위에서 심플하게 유지합니다.",
  },
  {
    title: "엔드투엔드 오너십",
    description:
      "ExtJS/React UI, Java API, MSSQL, WAS 배포까지 이어지는 흐름을 혼자서도 완성할 수 있습니다.",
  },
  {
    title: "빠른 실험",
    description:
      "필요 시 Flutter나 React를 활용해 모바일·웹 UI를 만들어 데이터를 검증하고, 결과를 다시 시스템에 반영합니다.",
  },
];

export default function HomeAbout() {
  return (
    <section className="my-24 grid gap-12 md:grid-cols-2">
      <div className="relative">
        <div className="absolute inset-0 rounded-3xl bg-emerald-200/40 blur-3xl" />
        <img
          className="relative h-[420px] w-full rounded-[32px] object-cover shadow-xl"
          src="/images/About1.jpg"
          alt="작업 공간"
        />
        <div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 px-6 py-4 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Since 2016
          </p>
          <p className="text-lg font-semibold text-slate-900">
            코드와 디자인 사이를 잇는 다리가 되다
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-500">
          About me
        </p>
        <h2 className="text-3xl font-bold text-slate-900">
          데이터 구조를 먼저 고민하는 제품 엔지니어입니다.
        </h2>
        <p className="text-base leading-relaxed text-slate-600">
          복잡한 업무 로직은 DB와 백엔드에서 단단하게 만들고, 필요한 UI는 ExtJS/React/Flutter로 직접 구현합니다.
          서버 배포와 협업 도구 세팅까지 스스로 책임지며 팀의 빈틈을 채워왔습니다.
        </p>
        <div className="space-y-4">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm"
            >
              <p className="text-sm font-semibold text-slate-900">
                {value.title}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
