import { Navigate } from "react-router-dom";
import { useAuthStore } from "../auth/authStore";
import type { UserRole } from "../auth/authStore";
import type { JSX } from "react";

type RequireAuthProps = {
  children: JSX.Element;
  roles?: UserRole[];
};

export const RequireAuth = ({ children, roles }: RequireAuthProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (roles && roles.length > 0 && !roles.some(role => user?.roles?.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
