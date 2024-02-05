import React from "react";

export default function Information() {
  return (
    <div className="flex flex-col gap-4 w-full mb-28 ">
      <div className="flex flex-row gap-x-40 items-center justify-items-center">
        <div className="flex flex-col ">
          <h1 className="mb-4 text-4xl font-extrabold leading-none text-gray-900 md:text-3xl lg:text-6xl dark:text-white">
            Front-End React
            <br />
            Developer 👋🏻
          </h1>
          <span className="text-PRIMARY text-base text-gray-500 max-w-lg">
            Hi, I'm SeongHyeon Choi. A passionate Front-end React Developer
            based in Gyeongi, Hwaseong.
          </span>

          <div className="flex flex-row gap-3 mt-4">
            <a href="https://notion.so">
              <img
                src="/images/notion.svg"
                alt="notion"
                width={30}
                height={30}
              />
            </a>
            <a href="https://github.com/choidz">
              <img
                src="/images/github.svg"
                alt="github"
                width={30}
                height={30}
              />
            </a>
          </div>
        </div>

        <div className="flex flex-col ">
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
