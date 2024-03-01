import HomeHero from "./section/home-hero";
import HomeSkills from "./section/home-skills";
import HomeAbout from "./section/home-about";
import HomeProjects from "./section/home-projects";

export default function layout() {
  return (
    <div className="bg-[#f9f9f9] flex flex-col w-full">
      <div className="mx-auto max-w-screen-lg ">
        <HomeHero />
        <HomeSkills />
        <HomeAbout />
        <HomeProjects />
      </div>
    </div>
  );
}
