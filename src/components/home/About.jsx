import React from "react";

export default function About() {
  return (
    <div className="flex flex-col gap-4 w-full mb-28 mt-4 items-center">
      <div className="flex flex-row gap-x-40 items-center justify-items-center">
        <div className="flex flex-col max-w-xl">
          <img
            className="rounded-xl w-80"
            src="/images/profile.jpeg"
            alt="description"
          />
        </div>

        <div className="flex flex-col max-w-3xl">
          <p className="text-PRIMARY text-base text-gray-500 max-w-lg">
            Hi, I'm SeongHyeon Choi. A passionate Front-end React Developer
            based in Gyeongi, Hwaseong.
          </p>
        </div>
      </div>
    </div>
  );
}
