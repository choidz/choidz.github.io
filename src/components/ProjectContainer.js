import React from "react";

function Project() {
  return (
    <div className="flex flex-col gap-y-4 items-center mb-16">
      <h1 className="mb-4 text-4xl font-extrabold leading-none text-gray-900 md:text-3xl lg:text-6xl dark:text-white">
        Project
      </h1>
      <a
        href="#!"
        className="flex flex-col items-center bg-white border border-gray-200 max-w-80 rounded-lg shadow md:flex-col  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <img
          class="object-fit w-full rounded-t-lg h-96 md:h-auto md:w-fit md:rounded-none md:rounded-s-lg"
          src="images/projects/DOB.png"
          alt=""
        />

        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Noteworthy technology acquisitions 2021
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Here are the biggest enterprise technology acquisitions of 2021 so
            far, in reverse chronological order.
          </p>
        </div>
      </a>
    </div>
  );
}

export default Project;
