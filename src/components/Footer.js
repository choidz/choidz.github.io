import React from "react";

// const ICONS = [
//     {
//       href: 'https://github.com/choidz',
//       src: '/images/icon/github-light.png',
//       alt: 'github-icon',
//     },
//     {
//       href: 'mailto:tjdgusxx@gmail.com',
//       src: '/images/icon/email.svg',
//       alt: 'mail-icon',
//     },
//     {
//       href: '',
//       src: '/images/icon/rss.svg',
//       alt: 'rss-icon',
//     },
//   ];

function Footer() {
  return (
    <footer class="bg-[#2d2e32] px-16 py-4 w-full shadow dark:bg-gray-800">
      <div class="w-full max-w-screen-xl p-4 ">
        <span class="text-sm text-white sm:text-center ">
          Choi seong hyeon
        </span>
        <br />
        <span class="text-sm text-white sm:text-center ">
          U1 Univ.
        </span>
        <br />
        <span class="text-sm text-white sm:text-center ">
          Hwaseong, Gyeong-gi, Republic of Korea
        </span>
       
        <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-white  sm:mt-0">
          <li>About</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
