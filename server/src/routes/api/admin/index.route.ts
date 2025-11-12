import express, { Router } from "express";
import subscriptionsRoute from "./subscriptions.route";

const router: Router = express.Router();

router.use("/subscriptions", subscriptionsRoute);

export default router;
