import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Information from "./Information";
import Skills from "./Skills";
import ProjectCard from "./Projects";
import ProjectSection from "./ProjectSection";
// import About from "./About";
export default function Layout() {
  return (
    <div className="bg-white-100 h-screen overflow-auto flex flex-row ">
      <div className="flex flex-col flex-1">
        <Header />
        <div className="md:container-lg md:mx-auto md:none mt-24 ">
          <Information />
          <Skills />
          {/* <About /> */}
          {/* <ProjectCard /> */}
          <ProjectSection />
        </div>

        <div className=" gap-4 w-full ">
          <Footer />
        </div>
      </div>
    </div>
  );
}
