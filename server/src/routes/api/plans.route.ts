import express, { type Router } from "express";
import { plansController } from "../../modules/plans/index";

const router: Router = express.Router();

router.get("/", plansController.getPlans);

export default router;
