import React from "react";
import Header from "../components/Header";


export default function Layout() {
  return (
    <div className="bg-neutral-100 h-screen w-screen overflow-auto flex flex-row">
      <div className="flex flex-col flex-1">
        <Header />
      </div>
    </div>
  );
}
