import { Link } from "react-router-dom";
import { blogPaths, portfolioPath } from "../routes/paths";
import HomeHero from "../section/home-hero";
import HomeSkills from "../section/home-skills";
import HomeAbout from "../section/home-about";
import HomeExperience from "../section/home-experience";
import HomeProjects from "../section/home-projects";
import HomeContact from "../section/home-contact";

export default function Layout() {
  return (
    <div className="flex w-full flex-col bg-[#f9f9f9]">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-screen-xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            to={portfolioPath}
            className="inline-flex items-center gap-2 text-xl font-bold text-slate-900"
          >
            <span className="hidden sm:inline text-slate-600">Portfolio</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Link
              to={blogPaths.home}
              className="inline-flex items-center rounded-full border border-slate-200 px-4 py-1.5 transition hover:border-[#00b05e]/40 hover:bg-[#00b05e]/10 hover:text-[#00b05e]"
            >
              블로그
            </Link>
            <Link
              to={portfolioPath}
              className="inline-flex items-center rounded-full bg-[#00b05e] px-4 py-1.5 text-white shadow-sm transition hover:bg-[#009a52]"
            >
              포트폴리오
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-16">
          <HomeHero />
          <HomeSkills />
          <HomeAbout />
          <HomeExperience />
          <HomeProjects />
          <HomeContact />
        </div>
      </main>
    </div>
  );
}
