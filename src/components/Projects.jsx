import React from "react";
import { useState } from "react";
import Card from "./Card/Card";

function Projects() {
  const [projects, updateProjects] = useState([
    {
      id: 1,
      title: "Do Our Best (DOB)",
      link: "https://github.com/choidz/DOB",
      date: "2022/11/14 → 2022/12/01",
      skills: ["Android", "Java", "SQLite"],
      projectPic: "/images/projects/DOB.png",
    },
    {
      id: 2,
      title: "SPLER",
      link: "https://github.com/choidz/SPLER",
      date: "2022/11/10 → 2022/12/10",
      skills: ["JSP", "JavaSript", "MySQL"],
      projectPic: "images/projects/SPLER.png",
    },
    {
      id: 3,
      title: "FLEA-CULTURE",
      link: "https://github.com/choidz/FLEACULTRE",
      date: "2016/12/05 → 2016/12/23",
      skills: ["JSP", "JavaScript", "Spring", "Mybatis"],
      projectPic: "images/projects/FLEA-CULTURE.png",
    },
  ]);

  return (
    <div className="flex flex-col gap-y-4 items-center mb-16">
      <h1 className="mb-4 text-4xl font-extrabold  leading-none text-gray-900 md:text-3xl lg:text-6xl dark:text-white">
        Project
      </h1>
      <div className="flex flex-col justify-between mt-4">
        {projects.map((project) => {
          return (
            <Card
              key={project.id}
              id={project.id}
              profilePic={project.projectPic}
              date={project.date}
              skills={project.skills}
              link={project.link}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Projects;
