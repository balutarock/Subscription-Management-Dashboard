import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import config from "../../configurations/env-config";
import { logger } from "../logger/index";
import ApiError from "./api-error";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let { statusCode, message } = err;
  if (config.env === "production" && !err.isOperational) {
    statusCode = 500;
    message = "Internal Server Error";
  }

  res.locals["errorMessage"] = err.message;

  const response = {
    success: false,
    code: statusCode,
    message,
    ...(config.env === "local" && { stack: err.stack }),
  };

  if (config.env === "local") {
    logger.error(err);
  }

  // Make sure the response hasn't been sent already
  if (!res.headersSent) {
    res.status(statusCode).json(response);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorConverter = (
  err: any,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  // Determine if this is a Prisma error
  const isPrismaError =
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientValidationError;

  // Convert non-ApiError to ApiError
  let error = err;
  if (!(error instanceof ApiError)) {
    // Fix: Properly handle different error types
    let statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    // Set specific status codes for Prisma errors
    if (isPrismaError) {
      statusCode = StatusCodes.BAD_REQUEST;
    }

    // Format a meaningful error message
    const message = error.message || `${StatusCodes[statusCode]}`;

    // Create a new ApiError
    error = new ApiError(statusCode, message, isPrismaError, err.stack);
  }

  // Pass the error to the next middleware
  next(error);
};
