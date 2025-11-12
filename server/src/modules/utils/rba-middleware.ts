import { ApiResponse, handleApiResponse } from "../utils/api-response";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../errors/index";
import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import { roleRights } from "../../configurations/roles";

// RBAC Middleware
const verifyCallback = async (
  req: Request,
  requiredRights: string[],
  resolve: () => void,
  reject: (error: ApiError) => void
) => {
  try {
    if (!req?.user) {
      return reject(new ApiError(StatusCodes.FORBIDDEN, "Forbidden"));
    }

    const userData = req.user as User;

    if (requiredRights.length > 0) {
      const userRights = userData.roles.flatMap(
        (role: string) => roleRights.get(role) || []
      );
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredRights) {
        return reject(
          new ApiError(
            StatusCodes.FORBIDDEN,
            "Forbidden: don't have access to this api"
          )
        );
      }
    }

    resolve();
  } catch (error) {
    console.error("RBAC Middleware Error:", error);
    reject(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error")
    );
  }
};

export const rbacMiddleware =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    new Promise<void>((resolve, reject) => {
      verifyCallback(req, requiredRights, resolve, reject);
    })
      .then(() => next())
      .catch((err) => next(err));
  };
