import React from "react";

const SKILLS = [
  [
    "html.png",
    "css.png",
    "js.png",
  ],
  [
    "react.png",
    "tailwind.png",
    "sass.png",
  ],
  [
    "photoshop.png",
    "illustrator.png",
  ],
];

function HomeSkills() {
  return (
      <div className="flex flex-row gap-x-16 mt-32 items-center">
        <span className="text-xl text-gray-900 dark:text-white border-r-2 border-neutral-700 pr-4	leading-5	">
          Skills & Ability
        </span>
        <div className="flex flex-row gap-x-8">
          {SKILLS.map((skillRow) => (
            <div className="flex flex-row-4 w-fit gap-x-2 items-center hover:-translate-y-1 hover:scale-110 duration-300">
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
  );
}

export default HomeSkills;
