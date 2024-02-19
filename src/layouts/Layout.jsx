import HomeHero from "./home/home-hero";
import HomeSkills from "./home/home-skills";
import HomeAbout from "./home/home-about";
import ProjectSection from "../components/projectCard";

export default function layout() {
  return (
      <div className="mx-auto max-w-screen-xl">
        <HomeHero />
        <HomeSkills />
        <HomeAbout />
        <ProjectSection />
      </div>
  );
}
