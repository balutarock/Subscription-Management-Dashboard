import express, { type Router } from "express";
import { authMiddleware } from "../../../modules/auth";
import { rbacMiddleware } from "../../../modules/utils/rba-middleware";
import * as subscriptionsController from "../../../modules/subscriptions/subscriptions.controller";
import { PERMISSIONS } from "../../../configurations/roles";

const router: Router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware.authorizationMiddleware());

// Admin only: Get all subscriptions
router.get(
  "/",
  rbacMiddleware(PERMISSIONS.GET_ALL_SUBSCRIPTIONS), // Using GET_HOSTED_STATUS as admin permission
  subscriptionsController.getAllSubscriptions
);

export default router;
