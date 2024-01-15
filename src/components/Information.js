import React from "react";

const INTRO = [
  {
    label: "GitHub",
    src: "/images/icon/github-dark.png",
    backgroundColor: "#ffffff",
    href: "https://github.com/choidz",
  },
  {
    label: "maplestory",
    src: "/images/icon/maplestory.png",
    backgroundColor: "#7B5D0F",
    href: "/home",
  },
];

function Information() {
  return (
    <div className="flex flex-row gap-4 w-full">
      <div className="flex flex-1 flex-col">
        <h1 className="mb-4 text-4xl font-extrabold leading-none text-gray-900 md:text-3xl lg:text-6xl dark:text-white">
          Hi I'm
          <br /> frontend developer
          <br />
          <span className="text-PRIMARY font-semibold">SeongHyeon choi</span>
        </h1>
        <div className="flex gap-1">
          {INTRO.map((list) => (
            <div
              key={list}
              className="text-BLACK hover:text-PRIMARY_HEAVY dark:hover:text-PRIMARY_HEAVY"
            >
              {list.label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
            

      </div>
    </div>
  );
}

export default Information;
