import React from "react";

export default function HomeAbout() {
  return (
    <div className="flex flex-row gap-x-12 my-52 items-center">
      <div className="flex flex-col max-w-3xl">
        <img
          className="rounded-xl w-96 h-80 object-cover "
          src="/images/About1.jpg"
          alt="description"
        />
      </div>

      <div className="flex flex-col max-w-lg">
        <p className="text-[#00b05e] font-bold text-lg">About Me</p>
        <p className="text-[#242938] font-extrabold text-2xl">
          A passionate Front-end React Developer based in Gyeongi, Hwaseong.
        </p>
        <p className="text-PRIMARY text-base text-gray-500 max-w-lg mt-4">
          유원대학교에서 컴퓨터공학을 전공하였고, 1인 기업(웹에이전시)에 들어가
          학업과 일을 병행 하며 HTML, CSS, JS, Photoshop, Illustrator 등을
          숙련하였습니다. 최근에는 ReactJS에 관심을 가져 공부중에 있습니다.
          사용자가 편리하게 사용할 웹을 만드는 웹프로그래머가 되기 위해 노력중인
          최성현입니다.
        </p>
      </div>
    </div>
  );
}
