import React from "react";
import Header from "../components/Header";
import Information from "../components/Information";

export default function Layout() {
  return (
    <div className="bg-neutral-100 h-screen overflow-auto flex flex-row">
      <div className="flex flex-col flex-1">
        <Header />
        <Information />
      </div>
    </div>
  );
}
