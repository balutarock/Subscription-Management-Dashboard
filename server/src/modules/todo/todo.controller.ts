import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiResponse, handleApiResponse } from "../utils/api-response";
import { catchAsync } from "../utils";
import * as todoService from "./todo.service";

export const getTodos = catchAsync(async (req: Request, res: Response) => {
  try {
    const todos = await todoService.getTodos();

    const responseData = ApiResponse.success(
      "todos retrieved successfully",
      todos,
    );
    return handleApiResponse(responseData, res);
  } catch (error: any) {
    const responseData = ApiResponse.failure(
      error.message || "Failed to retrieve todos",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
    return handleApiResponse(responseData, res);
  }
});

export const createTodo = catchAsync(async (req: Request, res: Response) => {
  try {
    // The body is now validated and typed by our validation middleware
    const todoData = req.body;
    const todos = await todoService.createTodo(todoData);

    const responseData = ApiResponse.success(
      "Todo created successfully",
      todos,
    );
    return handleApiResponse(responseData, res);
  } catch (error: any) {
    const responseData = ApiResponse.failure(
      error.message || "Failed to create todo",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
    return handleApiResponse(responseData, res);
  }
});

export const updateTodo = catchAsync(async (req: Request, res: Response) => {
  try {
    const { todoId } = req.params;
    const updateData = req.body;
    const todos = await todoService.updateTodo(todoId, updateData);

    const responseData = ApiResponse.success(
      "todo updated successfully",
      todos,
    );
    return handleApiResponse(responseData, res);
  } catch (error: any) {
    const responseData = ApiResponse.failure(
      error.message || "Failed to update todo",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
    return handleApiResponse(responseData, res);
  }
});

export const deleteTodo = catchAsync(async (req: Request, res: Response) => {
  try {
    const { todoId } = req.params;
    const todos = await todoService.deleteTodo(todoId);

    const responseData = ApiResponse.success(
      "todo deleted successfully",
      todos,
    );
    return handleApiResponse(responseData, res);
  } catch (error: any) {
    const responseData = ApiResponse.failure(
      error.message || "Failed to delete todo",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
    return handleApiResponse(responseData, res);
  }
});
