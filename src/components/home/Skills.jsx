import React from "react";

const SKILLS = [
  [
    "html.png",
    "css.png",
    "js.png",
  ],
  [
    "react.png",
    "next.png",
  ],
  [
    "tailwind.png",
    "sass.png",
  ],
  [
    "photoshop.png",
    "illustrator.png",
  ],
];

function Skills() {
  return (
    <div className="flex flex-col gap-4 w-full mb-32 ">
      <div className="flex flex-row gap-x-16 items-center">
        <span className="text-xl text-gray-900 dark:text-white border-r-2 border-neutral-700 pr-4	leading-5	">
          Skills & Ability
        </span>
        <div className="flex flex-row gap-x-8">
          {SKILLS.map((skillRow) => (
            <div className="flex flex-row-4 w-fit gap-x-2 items-center">
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
