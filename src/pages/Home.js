import React from "react";
import Header from "../components/Header";
import Information from "../components/Information";
import Skills from "../components/Skills";
import Footer from "../components/Footer";
import Project from "../components/ProjectContainer";

export default function Layout() {
  return (
    <div className="bg-white-100 h-screen overflow-auto flex flex-row">
      <div className="flex flex-col flex-1">
        <Header />
        <div className="md:container md:mx-auto md:none">
          <Information />
          <Skills />
          <Project />
          <div className="flex flex-row gap-4 w-full ">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
