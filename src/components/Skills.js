import React from "react";

const SKILLS = [
  [
    "html.svg",
    "css.svg",
    "javascript.svg",
    "Tailwind.svg",
    "bootstrap.svg",
    "photoshop.png",
    "illustrator.png",
  ],
];

function Skills() {
  return (
    <div className="flex flex-col gap-y-4 mb-16">
      <div className="flex flex-row gap-x-16 items-center">
        <span className="text-xl text-gray-900 dark:text-white border-r-2 border-neutral-700 pr-4	leading-5	">
          Skills & Ability
        </span>
        <div className="flex flex-col gap-3 ">
          {SKILLS.map((skillRow) => (
            <div className="flex flex-row-4 w-fit gap-x-4 items-center">
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
