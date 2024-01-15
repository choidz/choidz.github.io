import React from "react";
// import { Menu, Popover, Transition } from "@headlessui/react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";

const linkClass =
  "flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base";


const HEADER_LINKS = [
    {
      key: "about",
      label: "About",
      path: "/about",
    },
    {
      key: "portfolio",
      label: "Portfolio",
      path: "/portfolio",
    },
    {
      key: "skills",
      label: "Skills",
      path: "/skills",
    },
  ];

export default function Header() {
  return (
    <div className="bg-white h-16 p-4 px-14 flex justify-start items-center border-b border-gray-200">
      <div className="flex items-center gap-2 px-1 py-3">
        <div
          className="h-10 w-10 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage:
            'url("https://source.unsplash.com/80x80?face")',
          }}
        >
          <span className="sr-only">logo</span>
        </div>
        <span className="text-slate-700 text-lg">Choi SeongHyeon</span>
      </div>

      <div className="flex flex-1 item-center justify-end gap-2">
        {HEADER_LINKS.map((item) => (
          <HeaderLink key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
}

function HeaderLink({ item }) {
  const { pathname } = useLocation();

  return (
    <Link
      to={item.path}
      className={classNames(
        pathname === item.path
          ? "bg-neutral-700 text-white"
          : "text-black-400 text-lg ",
        linkClass
      )}
    >
      <span className="text-xl">{item.icon}</span>
      {item.label}
    </Link>
  );
}
