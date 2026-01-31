// client/src/features/todo/types.ts
import { z } from "zod";

// Base schema for todo
const todoBaseSchema = {
  title: z.string().min(1, "Title is required"),
  isCompleted: z.boolean().optional(),
};

// Schema for the request body
export const todoBodySchema = z.object(todoBaseSchema);

// Schema for URL parameters
export const todoParamsSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// Type for creating a new todo
export type CreateTodoInput = z.infer<typeof todoBodySchema>;

// Type for updating a todo (all fields optional)
export type UpdateTodoInput = Partial<CreateTodoInput>;

// Type for todo item (includes ID from the server)
export type Todo = CreateTodoInput & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

// Schema for the API response
export const todoResponseSchema = todoBodySchema.extend({
  id: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TodoResponse = z.infer<typeof todoResponseSchema>;
