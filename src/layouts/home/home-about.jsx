import React from "react";


export default function HomeAbout() {
  return (
      <div className="flex flex-row gap-x-40 ">
        <div className="flex flex-col max-w-xl">
          <img
            className="rounded-xl w-96 h-72"
            src="/images/About1.jpg"
            alt="description"
          />
        </div>

        <div className="flex flex-col max-w-3xl">
          <p className="mb-4 text-2xl font-extrabold leading-none text-gray-900 md:text-3xl lg:text-6xl dark:text-white">
            Front-End React
            <br />
            Developer 👋🏻
          </p>
          <p className="text-PRIMARY text-base text-gray-500 max-w-lg">
            Hi, I'm SeongHyeon Choi. A passionate Front-end React Developer
            based in Gyeongi, Hwaseong.
          </p>
        </div>
      </div>
  );
}
