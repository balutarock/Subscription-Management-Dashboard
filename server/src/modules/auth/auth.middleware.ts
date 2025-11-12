import { NextFunction, Request as ExpressRequest, RequestHandler, Response } from "express";
import { ApiResponse, handleApiResponse } from "../utils/api-response";
import { User } from "@prisma/client";
import { usersService } from "../users";
import jwt from "jsonwebtoken";

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Create a new type that includes our custom properties
type Request = ExpressRequest;
import envConfig from "../../configurations/env-config";

const ACTIVITY_UPDATE_THRESHOLD = 10 * 60 * 1000; // 10 minutes

export interface ClaimsBase {
  [name: string]: string | number | boolean | undefined;

  aud: string;
  iss: string;
  exp: number;
  iat: number;
  sub: string;
  token_use: "id" | "access";
}

/**
 * Some id token specific claims
 */
export interface IdTokenClaims extends ClaimsBase {
  "cognito:username": string;
  email?: string;
  email_verified?: string;
  auth_time: string;
  token_use: "id";
}

/**
 * Some access token specific claims
 */
export interface AccessTokenClaims extends ClaimsBase {
  username?: string;
  token_use: "access";
}

/**
 * Express middleware for JWT token validation with improved error handling
 */
export const authorizationMiddleware =
  (): RequestHandler =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const authHeader =
        req.header("Authorization") || req.header("authorization");
      if (!authHeader) {
        const responseData = ApiResponse.failure("Unauthenticated", null, 401);
        return handleApiResponse(responseData, res);
      }

      const token = authHeader.split(" ")[1]; // "Bearer <token>"
      if (!token) {
        const responseData = ApiResponse.failure("Unauthenticated", null, 401);
        return handleApiResponse(responseData, res);
      }
      let userId = "" as string;
      try {
        const decoded = jwt.verify(token, envConfig.jwtSecret) as {
          userId: string;
          email: string;
        };
        userId = decoded.userId;
      } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const userInfo = (await usersService.getUserById(userId)) as User;
      if (!userInfo) {
        const responseData = ApiResponse.failure("Unauthenticated", null, 401);
        return handleApiResponse(responseData, res);
      }
      req.user = userInfo as User;
      return next();
    } catch (error) {
      console.error("Authorization Middleware Error:", error);
      const responseData = ApiResponse.failure(
        "Internal Server Error",
        null,
        500
      );
      return handleApiResponse(responseData, res);
    }
  };
