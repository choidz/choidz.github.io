import React from "react";

const SKILLS = [
  ["react.png", "nextjs.png", "android.svg"],
  ["Tailwind.svg", "bootstrap.svg"],
  ["git.png", "mysql.png"],
  ["figma.png", "photoshop.png", "illustrator.png"],
];

function Skills() {
  return (
    <div className="flex flex-col gap-y-4 items-center mb-16">
        <h1 className="mb-4 text-4xl font-extrabold leading-none text-gray-900 md:text-3xl lg:text-6xl dark:text-white">
          Skills & Ability
        </h1>
      <div className="flex flex-col gap-3 mt-4">
        {SKILLS.map((skillRow) => (
          <div className="flex flex-cols-4 w-fit gap-x-8 items-center">
            {skillRow.map((skill) => (
              <img
                className="w-auto h-28 "
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

export default Skills;
