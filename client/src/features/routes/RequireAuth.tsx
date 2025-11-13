import { Navigate } from "react-router-dom";
import type { JSX } from "react";

type UserRole = string; // Define or import the actual UserRole type if needed

type RequireAuthProps = {
  children: JSX.Element;
  roles?: UserRole[];
};

const getAuthData = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  return {
    isAuthenticated: !!token,
    user: userData ? JSON.parse(userData) : null
  };
};

export const RequireAuth = ({ children, roles }: RequireAuthProps) => {
  const { isAuthenticated, user } = getAuthData();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (roles && roles.length > 0 && !roles.some(role => user?.roles?.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
