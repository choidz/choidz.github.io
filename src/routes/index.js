import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { blogPaths, page404, portfolioPath } from "./paths";

const BlogHome = lazy(() => import("../blog/layout"));
const BlogPost = lazy(() => import("../blog/post-page"));
const Portfolio = lazy(() => import("../home/layout"));
const NotFound = lazy(() => import("./not-found"));

export default function Router() {
  return useRoutes([
    {
      path: blogPaths.home,
      element: (
        <Suspense fallback="Loading ...">
          <BlogHome />
        </Suspense>
      ),
    },
    {
      path: blogPaths.detail,
      element: (
        <Suspense fallback="Loading ...">
          <BlogPost />
        </Suspense>
      ),
    },
    {
      path: portfolioPath,
      element: (
        <Suspense fallback="Loading ...">
          <Portfolio />
        </Suspense>
      ),
    },
    {
      path: page404.page404,
      element: (
        <Suspense fallback="Loading ...">
          <NotFound />
        </Suspense>
      ),
    },
    {
      path: "*",
      element: <Navigate to={page404.page404} replace />,
    },
  ]);
}
