import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { page404 } from "./paths";

const Home = lazy(() => import("../home/layout"));

export default function Router() {
  return useRoutes([
    {
      path: page404.home,
      element: (
        <Suspense fallback="Loading ...">
          <Home />
        </Suspense>
      ),
    },
    // no match 404
    {
      path: "*",
      element: <Navigate to={page404.page404} replace />,
    },
  ]);
}
