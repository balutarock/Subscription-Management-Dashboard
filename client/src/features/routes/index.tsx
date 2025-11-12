import type { IndexRouteObject, NonIndexRouteObject, RouteObject as ReactRouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { OpenLayout } from "@/components/layouts/open-layout";
import { SignUpPage } from "../auth/pages/sign-up";
import { SignInPage } from "../auth/pages/sign-in";
import { DashboardPage } from "../dashboard/pages/dashboard";
import { PlansPage } from "../plans/pages/plans";
import { AdminSubscriptionsPage } from "../admin/pages/subscriptions";
import { RequireAuth } from "./RequireAuth";

export type RouteObject = IndexRouteObject | NonIndexRouteObject;

// Public routes - accessible to everyone
const publicRoutes: ReactRouteObject[] = [
  {
    path: "/sign-in",
    element: (
      <OpenLayout>
        <SignInPage />
      </OpenLayout>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <OpenLayout>
        <SignUpPage />
      </OpenLayout>
    ),
  },
  {
    path: "/unauthorized",
    element: <div>Unauthorized</div>,
  },
];

// Protected routes - require authentication
const protectedRoutes: ReactRouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <DashboardPage />
      </RequireAuth>
    ),
  },
  {
    path: "/plans",
    element: (
      <RequireAuth>
        <PlansPage />
      </RequireAuth>
    ),
  },
];

// Admin routes - require admin role
const adminRoutes: ReactRouteObject[] = [
  {
    path: "/admin/subscriptions",
    element: (
      <RequireAuth roles={['admin']}>
        <AdminSubscriptionsPage />
      </RequireAuth>
    ),
  },
];

// Combine all routes
export const routes = [
  ...publicRoutes,
  ...protectedRoutes,
  ...adminRoutes,
  {
    path: "*",
    element: <Navigate to="/sign-in" replace />,
  },
];
