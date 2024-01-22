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
    <footer class="bg-white rounded-lg shadow dark:bg-gray-800">
      <div class="w-full max-w-screen-xl p-4 ">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          Choi seong hyeon
        </span>
        <br />
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          U1 Univ.
        </span>
        <br />
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          Hwaseong, Gyeong-gi, Republic of Korea
        </span>
       
        <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>About</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
