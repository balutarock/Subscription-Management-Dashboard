import express, { type Router } from "express";
import { authMiddleware } from "../../modules/auth";
import { rbacMiddleware } from "../../modules/utils/rba-middleware";
import { validateRequest } from "../../modules/validate";
import * as subscriptionsController from "../../modules/subscriptions/subscriptions.controller";
import { SubscribeToPlanValidation } from "../../modules/subscriptions/subscriptions.validation";
import { PERMISSIONS } from "../../configurations/roles";

const router: Router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware.authorizationMiddleware());

// User subscribes to a plan
router.post(
  "/:planId",
  validateRequest(SubscribeToPlanValidation),
  rbacMiddleware(PERMISSIONS.CREATE_SUBSCRIPTION),
  subscriptionsController.subscribeToPlan
);

// Get current user's subscription
router.get(
  "/my-subscription",
  rbacMiddleware(PERMISSIONS.GET_MY_SUBSCRIPTION), // Reusing GET_PLANS permission for viewing own subscription
  subscriptionsController.getMySubscription
);

export default router;
