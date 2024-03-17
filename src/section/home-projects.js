import React from "react";
import ProjectCard from "../components/projectCard";

function HomeProjects() {
  return (
    <div className="">
      <div className="mb-12">
        <p className="text-[#00b05e] font-bold text-lg">PORTFOLIO</p>
        <p className="text-[#242938] font-extrabold text-2xl">Introducing the projects created by me and my team ⚙️</p>
      </div>
      <div>
        <ProjectCard />
      </div>
    </div>
  );
}

export default HomeProjects;
