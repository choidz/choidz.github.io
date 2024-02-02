import React from "react";

const PROJECTS = [
  {
    title: "Do Our Best (DOB)",
    description: `조별 과제 현황을 한 눈에 체크하고 기한을 기준으로 각 조원의 기여도를 체크할 수 있습니다.`,
    image: "DOB.png",
    date: "2022/11/14 → 2022/12/01",
    tags: ["Android", "Java", "SQLite"],
    gitLink: "https://github.com/choidz/DOB",
    notionLink: "https://github.com/choidz/DOB",
    gitIcon: "github.svg",
    notionIcon: "notion.svg",
  },
  {
    title: "SPLER",
    description: `조별 과제 현황을 한 눈에 체크하고 기한을 기준으로 각 조원의 기여도를 체크할 수 있습니다.`,
    image: "SPLER.png",
    date: "2022/11/14 → 2022/12/01",
    tags: ["Android", "Java", "SQLite"],
    gitLink: "https://github.com/choidz/SPLER",
    notionLink: "https://github.com/choidz/DOB",
    gitIcon: "github.svg",
    notionIcon: "notion.svg",
  },
  {
    title: "FleaCulture",
    description: `조별 과제 현황을 한 눈에 체크하고 기한을 기준으로 각 조원의 기여도를 체크할 수 있습니다.`,
    image: "FLEA-CULTURE.png",
    date: "2022/11/14 → 2022/12/01",
    tags: ["Android", "Java", "SQLite"],
    notionLink: "https://github.com/choidz/DOB",
    notionIcon: "notion.svg",
  },
];

export default function ProjectSection() {
  return (
    <div className="flex flex-col max-w-3xl">
      {PROJECTS.map((project) => (
        <div className="flex flex-row gap-6">
          <div className="w-full h-full flex items-center justify-center">
            <img
              className="rounded-xl"
              src={`images/projects/${project.image}`}
              alt=""
            />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-md text-bold"> {project.title}</p>
            <p> {project.date}</p>
            <p className=""> {project.tags}</p>

            <div className="flex flex-row gap-3 mt-4">
              <a href="https://notion.so">
                <img
                  className="hover:"
                  src="/images/notion.svg"
                  alt="notion"
                  width={30}
                  height={30}
                />
              </a>
              <a href="https://github.com/choidz">
                <img
                  src="/images/github.svg"
                  alt="github"
                  width={30}
                  height={30}
                />
              </a>
            </div>

            {/* {PROJECTS.map((link) => (
              <div className="flex flex-row">
                <a href={link.gitLink}>
                  <img className="" src={`images/${project.gitIcon}`} alt="" />
                </a>
              </div>
            ))} */}
          </div>
        </div>
      ))}
    </div>
  );
}
