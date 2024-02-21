import React from "react";

const PROJECTS = [
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
    title: "SPLER",
    description: `조별 과제 현황을 한 눈에 체크하고 기한을 기준으로 각 조원의 기여도를 체크할 수 있습니다.`,
    image: "SPLER.png",
    date: "2022/11/14 → 2022/12/01",
    tags: ["Android", "Java", "SQLite"],
    gitLink: "https://github.com/choidz/SPLER",
    notionLink:
      "https://choidz.notion.site/Study-Project-Player-SPLER-a6a7ca0ed5af41c3a9f4ad7e25a01d07?pvs=74",
    gitIcon: "images/github.svg",
    notionIcon: "images/notion.svg",
  },
  {
    title: "FleaCulture",
    description: `조별 과제 현황을 한 눈에 체크하고 기한을 기준으로 각 조원의 기여도를 체크할 수 있습니다.`,
    image: "FLEA-CULTURE.png",
    date: "2022/11/14 → 2022/12/01",
    tags: ["Android", "Java", "SQLite"],
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
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl mb-16">
          <div class="md:flex max-x-3xl">
            <div class="md:shrink-0">
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
              <p class="mt-2 text-slate-500">{project.tags}</p>
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
