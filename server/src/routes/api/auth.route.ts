import express, { type Router } from "express";
// import { appsController } from "../../modules/appointment/credentials";
import { authController } from "../../modules/auth";
import {
  CreateUserValidation,
  LoginUserValidation,
} from "../../modules/users/users.validation";
import { validateRequest } from "../../modules/validate";

const router: Router = express.Router();

router.post(
  "/register",
  validateRequest(CreateUserValidation),
  authController.register
);

router.post(
  "/login",
  validateRequest(LoginUserValidation),
  authController.login
);

export default router;
