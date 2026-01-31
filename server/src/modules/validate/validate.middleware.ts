import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, ZodSchema } from "zod";
import { logger } from "../logger";
import { ApiResponse, handleApiResponse } from "../utils/api-response";

export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (err) {
      const firstError = (err as ZodError)?.issues[0];
      logger.info("Validation error:", firstError);
      const errorMessage = `Invalid input: ${firstError?.message}`;
      const statusCode = StatusCodes.BAD_REQUEST;
      const serviceResponse = ApiResponse.failure(
        errorMessage,
        null,
        statusCode,
      );
      // @ts-expect-error return if validation error occurs
      return handleApiResponse(serviceResponse, res);
    }
  };
