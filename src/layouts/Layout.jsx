import HomeHero from "./home/home-hero";
import Skills from "../components/skills";
import HomeAbout from "./home/home-about";
import ProjectSection from "../components/projectCard";

export default function layout() {
  return (
    <div className="h-screen overflow-auto flex flex-row ">
      <div className="className='flex flex-col justify-center gap-14 md:gap-16 py-16">
        <HomeHero />
        <Skills />
        <HomeAbout />
        <ProjectSection />
      </div>
    </div>
  );
}
