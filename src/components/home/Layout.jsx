import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Information from "./Information";
import Skills from "./Skills";
import ProjectSection from "../ProjectSection";
export default function Layout() {
  return (
    <div className="bg-[#f9f9f9] h-screen overflow-auto flex flex-row ">
      <div className="flex flex-col flex-1">
        <Header />
        <div className="mt-24 ">
          <Information />
          <Skills />
          <ProjectSection />
        </div>
        <div className=" gap-4 w-full ">
          <Footer />
        </div>
      </div>
    </div>
  );
}
