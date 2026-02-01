import React from "react";
import ProjectCard from "../components/projectCard";
import { PROJECTS } from "../data/portfolio";

function HomeProjects() {
  return (
    <section className="my-24 space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-500">
          Portfolio
        </p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">
          팀과 함께 만든 제품 사례
        </h2>
        <p className="mt-2 text-base text-slate-600">
          실제 사용자 피드백을 반영하며 빠르게 배포했던 프로젝트들입니다.
        </p>
      </div>
      <div className="space-y-8">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

export default HomeProjects;
