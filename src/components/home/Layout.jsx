import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Information from "./Information";
import Skills from "./Skills";
import ProjectSection from "./ProjectSection";
import About from "./About";
export default function Layout() {
  return (
    <div className="h-screen overflow-auto flex flex-row ">
      <div className="flex flex-col flex-1">
        <Header />
        <div className=" pt-24 pb-16 md:container md:mx-auto">
          <Information />
          <Skills />
          </div>
          
          <div className="md:container">
            <About />
          <ProjectSection />
        </div>
        <div className=" gap-4 w-full ">
          <Footer />
        </div>
      </div>
    </div>
  );
}
