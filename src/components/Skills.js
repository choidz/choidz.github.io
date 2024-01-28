import React from "react";

const SKILLS = [
  [
    "html.svg",
    "css.svg",
    "javascript.svg",
    "typescript.svg",
    "react.png",
    "nextjs.png",
  ],
  ["Tailwind.svg", "styled-component.svg", "bootstrap.svg"],
  ["git.png", "mysql.png"],
  ["figma.png", "photoshop.png", "illustrator.png"],
];

function Skills() {
  return (
    <div className="flex flex-col gap-y-4 mb-16">
      <div className="flex flex-row gap-x-40 justify-items-center">
        <span className="mb-4 text-xl text-gray-900 dark:text-white">
          Skills & Ability
        </span>
        <div className="flex flex-col gap-3 mt-4">
          {SKILLS.map((skillRow) => (
            <div className="flex flex-cols-4 w-fit gap-x-8 items-center">
              {skillRow.map((skill) => (
                <img
                  className="w-auto h-12 rounded-md	"
                  src={`/images/skills/${skill}`}
                  alt="skills"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Skills;
