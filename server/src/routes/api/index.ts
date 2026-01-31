import express, { Router } from "express";
import authRoute from "./auth.route";
import plansRoute from "./plans.route";
import subscriptionsRoute from "./subscriptions.route";
import adminRoute from "./admin/index.route";
import todoRoute from "./todo.route";
const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/plans",
    route: plansRoute,
  },
  {
    path: "/subscriptions",
    route: subscriptionsRoute,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
  {
    path: "/todo",
    route: todoRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
