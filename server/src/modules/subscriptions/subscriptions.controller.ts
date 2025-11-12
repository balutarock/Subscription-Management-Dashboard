import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiResponse, handleApiResponse } from "../utils/api-response";
import { catchAsync } from "../utils";
import * as subscriptionsService from "./subscriptions.service";

export const subscribeToPlan = catchAsync(
  async (req: Request, res: Response) => {
    const { planId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      const responseData = ApiResponse.failure(
        "User not authenticated",
        null,
        StatusCodes.UNAUTHORIZED
      );
      return handleApiResponse(responseData, res);
    }

    try {
      const subscription = await subscriptionsService.subscribeToPlan({
        userId,
        planId,
      });

      const responseData = ApiResponse.success(
        "Successfully subscribed to plan",
        subscription
      );
      return handleApiResponse(responseData, res);
    } catch (error: any) {
      const responseData = ApiResponse.failure(
        error.message || "Failed to subscribe to plan",
        null,
        StatusCodes.BAD_REQUEST
      );
      return handleApiResponse(responseData, res);
    }
  }
);

export const getMySubscription = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      const responseData = ApiResponse.failure(
        "User not authenticated",
        null,
        StatusCodes.UNAUTHORIZED
      );
      return handleApiResponse(responseData, res);
    }

    try {
      const subscription = await subscriptionsService.getUserSubscription(
        userId
      );

      if (!subscription) {
        const responseData = ApiResponse.success(
          "No active subscription found",
          null
        );
        return handleApiResponse(responseData, res);
      }

      const responseData = ApiResponse.success(
        "Subscription retrieved successfully",
        subscription
      );
      return handleApiResponse(responseData, res);
    } catch (error: any) {
      const responseData = ApiResponse.failure(
        error.message || "Failed to retrieve subscription",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      return handleApiResponse(responseData, res);
    }
  }
);

export const getAllSubscriptions = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const subscriptions = await subscriptionsService.getAllSubscriptions();
      const responseData = ApiResponse.success(
        "Subscriptions retrieved successfully",
        subscriptions
      );
      return handleApiResponse(responseData, res);
    } catch (error: any) {
      const responseData = ApiResponse.failure(
        error.message || "Failed to retrieve subscriptions",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      return handleApiResponse(responseData, res);
    }
  }
);
