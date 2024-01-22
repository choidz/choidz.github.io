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
       <div className="flex items-center gap-2 px-1 py-3">
          <div
            className="h-16 w-16 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage:
                'url("profile.jpeg")',
            }}
          >
          <img class="rounded-full " src="/images/profile.jpeg" alt="description" />

          </div>

        </div>
      <div className="flex flex-1 flex-col">
        <h1 className="mb-4 text-4xl font-extrabold leading-none text-gray-900 md:text-3xl lg:text-6xl dark:text-white">
          Hi I'm
          <br /> frontend developer
          <br />
          <span className="text-PRIMARY font-semibold">SeongHyeon choi</span>
        </h1>
      </div>

      <div className="flex flex-1 flex-col">
       
      </div>
    </div>
  );
}

export default Information;
