import React from "react";

function ProjectCard2() {
  return (
    <div className="flex flex-col gap-y-4 items-center mb-16">
      <h1 className="mb-4 text-4xl font-extrabold leading-none text-gray-900 md:text-3xl lg:text-6xl dark:text-white">
        Project
      </h1>

      <div className="flex flex-row items-center gap-x-16">
        <a
          href="#!"
          className="flex flex-col items-center bg-white border border-gray-200 max-w-80 rounded-lg shadow md:flex-col  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 "
        >
          <img
            class="object-fit w-full rounded-t-lg h-96 md:h-auto md:w-fit md:rounded-none md:rounded-s-lg p-4 "
            src="images/projects/DOB.png"
            alt=""
          />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              DOB
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"></p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              2016/12/05 ~ 2016/12/23 (약3주)
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              java, jquery, spring, Mybatis
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              <a href="#!">github.com</a>
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              팀프로젝트, 프로젝트 최우수상
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}

export default ProjectCard2;
