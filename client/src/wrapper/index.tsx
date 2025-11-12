import { useRoutes } from "react-router-dom";
import { routes } from "@/features/routes";

export const RootWrapper = () => {
  const element = useRoutes(routes);
  return element;
};
