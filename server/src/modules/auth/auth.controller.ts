import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { usersService } from "../users";
import envConfig from "../../configurations/env-config";
import { ApiResponse, handleApiResponse } from "../utils/api-response";
import { catchAsync } from "../utils";
import { StatusCodes } from "http-status-codes";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { password, name } = req.body;
  const email = req.body?.email?.trim().toLowerCase();

  const user = await usersService.getUserByEmail(email);
  if (user) {
    const responseData = ApiResponse.failure(
      "User with provided email already exists",
      null,
      StatusCodes.NOT_FOUND
    );
    return handleApiResponse(responseData, res);
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await usersService.createUser({
    email,
    password: hashedPassword,
    name,
  });

  const responseData = ApiResponse.success("success", newUser);
  return handleApiResponse(responseData, res);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password);

  const user = await usersService.getUserByEmail(email);
  if (!user) {
    const responseData = ApiResponse.failure(
      "User with provided email does not exist",
      null,
      StatusCodes.NOT_FOUND
    );
    return handleApiResponse(responseData, res);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    const responseData = ApiResponse.failure(
      "Invalid credentials",
      null,
      StatusCodes.UNAUTHORIZED
    );
    return handleApiResponse(responseData, res);
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    envConfig.jwtSecret,
    {
      expiresIn: "1h",
    }
  );

  const responseData = ApiResponse.success("success", { user, token });
  return handleApiResponse(responseData, res);
});
