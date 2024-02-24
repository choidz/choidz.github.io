import React from "react";
import { getTags } from "./tags";

const PROJECTS = [
  {
    title: "SPLER",
    description: `스터디 모임과 사이드 프로젝트 등을 함깨할 개발자들을 찾는 장소(커뮤니티)를 만들어 쉽게 인원을 구할 수 있도록 하는 웹 서비스`,
    image: "SPLER.png",
    date: "2022/11/10 → 2022/12/10",
    tags: ["Java", "JSP", "JAVASCRIPT", "MySQL", "HTML", "CSS"],
    gitLink: "https://github.com/choidz/SPLER",
    notionLink:
      "https://choidz.notion.site/Study-Project-Player-SPLER-a6a7ca0ed5af41c3a9f4ad7e25a01d07?pvs=74",
    gitIcon: "images/github.svg",
    notionIcon: "images/notion.svg",
  },
  {
    title: "Do Our Best (DOB)",
    description: `조별 과제 현황을 한 눈에 체크하고 기한을 기준으로 각 조원의 기여도를 체크할 수 있습니다.`,
    image: "DOB2.png",
    date: "2022/11/14 → 2022/12/01",
    tags: ["Android", "Java", "SQLite"],
    gitLink: "https://github.com/choidz/DOB",
    notionLink:
      "https://choidz.notion.site/Do-Our-Best-DOB-fc34f19ca18240edb2301f9f081159ce?pvs=74",
    gitIcon: "images/github.svg",
    notionIcon: "images/notion.svg",
  },
  {
    title: "FleaCulture",
    description: `Flea Market과 Culture의 합성어이며 자신이 정성 들여 만든 제품이나 자신의 재능을 나누는 것이 사람들에게 
    가치 있는 것으로 생각되면서 지역 곳곳의 장소나 카페에서 플리마켓, 버스킹, 푸드트럭 등 많은 FLEA CULTURE들의 위치를 찾을 수 있는 서비스`,
    image: "FLEA-CULTURE.png",
    date: "2016/12/05 → 2016/12/23",
    tags: ["Java", "JSP", "JAVASCRIPT", "Spring", "HTML", "CSS", "Mybatis"],
    notionLink:
      "https://choidz.notion.site/FLEA-CULTURE-1e029e3f3b0d43b9985ff93a98ec087b?pvs=74",
    notionIcon: "images/notion.svg",
    gitIcon: "images/github.svg",
  },
];

export default function ProjectCard() {
  return (
    <>
      {PROJECTS.map((project) => (
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-4xl mb-16 ">
          <div class="md:flex items-center max-x-3xl">
            <div class="md:shrink-0 md:h-80">
              <img
                class="p-4 h-48 w-full object-cover md:h-full md:w-96"
                src={`images/projects/${project.image}`}
                alt="projectImg"
              />
            </div>
            <div class="p-12">
              <div class="uppercase tracking-wide text-sm text-[#00b05e] font-semibold">
                {project.title}
              </div>
              <a
                href="#!"
                class="block mt-1 text-lg leading-tight font-medium text-black"
              >
                {project.description}
              </a>
              <p class="mt-2 text-slate-500">{project.date}</p>
              <div className="flex flex-row gap-x-2">
                {project.tags.map((tag) => (
                  <p class="mt-2 text-slate-500 ">
                    {getTags(tag)}
                  </p>
                ))}
              </div>
              <div className="flex flex-row gap-3 mt-4">
                <a href={project.notionLink} target="_blink">
                  <img
                    src={project.notionIcon}
                    alt="notion"
                    width={30}
                    height={30}
                  />
                </a>
                <a href={project.gitLink} target="_blink">
                  <img
                    src={project.gitIcon}
                    alt="github"
                    width={30}
                    height={30}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
