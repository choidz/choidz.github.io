import { Link } from "react-router-dom";
import { blogPaths } from "./paths";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="max-w-md space-y-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          404
        </p>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          요청하신 페이지가 존재하지 않거나 이동되었어요. 아래 버튼을 눌러 홈으로
          돌아가 주세요.
        </p>
        <Link
          to={blogPaths.home}
          className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
        >
          블로그 홈으로 가기
        </Link>
      </div>
    </div>
  );
}
