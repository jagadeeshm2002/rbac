import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import HomePage from "@/pages/HomePage";
import { Loader2 } from "lucide-react";

// Layouts
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));


// AuthProvider
const AuthProvider = lazy(() => import("@/config/authProvider"));

// Pages

const AdminDashBoard = lazy(() => import("@/pages/admin/index"));
const Manager = lazy(() => import("@/pages/manager/index"));
const Users = lazy(() => import("@/pages/admin/Users"));
const UserPage = lazy(() => import("@/pages/users/index"));
const Roles = lazy(() => import("@/pages/admin/Roles"));
const ApiTesting = lazy(() => import("@/pages/ApiTesting"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Unauthorized = lazy(() => import("@/pages/unauthorized"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className=" h-12 w-12 ">
      <Loader2 className="h-12 w-12 animate-spin"></Loader2>
    </div>
  </div>
);

const routes = [
  { path: "/", element: <HomePage /> },
  {
    path: "/users",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthProvider roles={["user"]}>
          <UserPage />
        </AuthProvider>
      </Suspense>
    ),
  },
  { path: "/unauthorized", element: <Unauthorized /> },

  {
    element: (
      <AuthProvider roles={["admin", "manager"]}>
        <DashboardLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: "/admin",

        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AuthProvider roles={["admin"]}>
                  <AdminDashBoard />
                </AuthProvider>
              </Suspense>
            ),
          },
          {
            path: "manage-users",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AuthProvider roles={["admin"]}>
                  <Users />
                </AuthProvider>
              </Suspense>
            ),
          },
          {
            path: "manage-roles",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AuthProvider roles={["admin"]}>
                  <Roles />
                </AuthProvider>
              </Suspense>
            ),
          },
          {
            path: "api-testing",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AuthProvider roles={["admin"]}>
                  <ApiTesting />
                </AuthProvider>
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/manager",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuthProvider roles={["manager"]}>
              <Manager />
            </AuthProvider>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    ),
  },
];

export const router = createBrowserRouter(routes);
