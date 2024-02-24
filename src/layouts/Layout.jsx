import HomeHero from "./home/home-hero";
import HomeSkills from "./home/home-skills";
import HomeAbout from "./home/home-about";
import HomeProjects from "./home/home-projects";

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
