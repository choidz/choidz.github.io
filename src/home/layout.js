import { Link } from "react-router-dom";
import { blogPaths, portfolioPath } from "../routes/paths";
import HomeAbout from "../section/home-about";
import HomeHero from "../section/home-hero";
import HomeProjects from "../section/home-projects";
import HomeSkills from "../section/home-skills";

export default function layout() {
  return (
    <div className='bg-[#f9f9f9] flex flex-col w-full'>
      <header className='border-b border-slate-200 bg-white/80 backdrop-blur'>
        <div className='mx-auto flex h-16 w-full max-w-screen-lg items-center justify-between gap-4 px-4 sm:px-6'>
          <Link
            to={portfolioPath}
            className='inline-flex items-center gap-2 text-xl font-bold text-slate-900'>
            <span className='hidden sm:inline text-slate-600'>Portfolio</span>
          </Link>
          <nav className='flex items-center gap-2 text-sm font-medium text-slate-600'>
            <Link
              to={blogPaths.home}
              className='inline-flex items-center rounded-full border border-slate-200 px-4 py-1.5 transition hover:border-[#00b05e]/40 hover:bg-[#00b05e]/10 hover:text-[#00b05e]'>
              블로그
            </Link>
            <Link
              to={portfolioPath}
              className='inline-flex items-center rounded-full bg-[#00b05e] px-4 py-1.5 text-white shadow-sm transition hover:bg-[#009a52]'>
              포트폴리오
            </Link>
          </nav>
        </div>
      </header>
      <div className='mx-auto max-w-screen-lg '>
        <HomeHero />
        <HomeSkills />
        <HomeAbout />
        <HomeProjects />
      </div>
    </div>
  );
}
