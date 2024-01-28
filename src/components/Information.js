import React from "react";


// const INTRO = [
//   {
//     label: "GitHub",
//     src: "/images/icon/github-dark.png",
//     backgroundColor: "#ffffff",
//     href: "https://github.com/choidz",
//   },
//   {
//     label: "maplestory",
//     src: "/images/icon/maplestory.png",
//     backgroundColor: "#7B5D0F",
//     href: "/home",
//   },
// ];

function Information() {
  return (
    <div className="flex flex-col gap-4 w-full mb-16 items-center">
      <div className="flex flex-row gap-x-40 items-center justify-items-center">
        <div className="flex flex-col max-w-3xl">
          <h1 className="mb-4 text-4xl font-extrabold leading-none text-gray-900 md:text-3xl lg:text-6xl dark:text-white"  >
            Front-End React
            <br />
            Developer 👋🏻
          </h1>
          <span className="text-PRIMARY text-base text-gray-500 max-w-lg">
            Hi, I'm SeongHyeon Choi. A passionate Front-end React Developer
            based in Gyeongi, Hwaseong.
           
          </span>

          <div className="flex flex-row gap-4 items-center justify-items-center">
            <a className="" href="github.com/choidz" target="_black">
              {<img src="images/github.svg" alt="github" />}
            </a>
          </div>
        </div>

        <div className="flex flex-col max-w-xl">
          <img
            className="rounded-full w-80"
            src="/images/profile.jpeg"
            alt="description"
          />
        </div>
      </div>
    </div>
  );
}

export default Information;
