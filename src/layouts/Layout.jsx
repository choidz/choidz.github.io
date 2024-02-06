import React from "react";
import Header from "./header";
import Footer from "./footer";
// import Information from "../home/home-hero";
// import Skills from "../components/skills";
// import ProjectSection from "../components/projectCard";
// import About from "../home/home-about";
export default function Layout() {
  return (
    <div className="h-screen overflow-auto flex flex-row ">
      <div className="flex flex-col flex-1">
        <Header />
        {/* <div className=" pt-24 pb-16 md:container md:mx-auto">
          <Information />
          <Skills />
          </div>
          
          <div className="md:container">
            <About />
          <ProjectSection />
        </div> */}
        <div className=" gap-4 w-full ">
          <Footer />
        </div>
      </div>
    </div>
  );
}
