import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catch-async";
import { ApiResponse, handleApiResponse } from "../utils/api-response";
import { plansService } from "./index";

export const getPlans = catchAsync(async (req: Request, res: Response) => {
  const plans = await plansService.getPlans();
  const response = ApiResponse.success("Plans fetched successfully", plans);
  return handleApiResponse(response, res);
});
