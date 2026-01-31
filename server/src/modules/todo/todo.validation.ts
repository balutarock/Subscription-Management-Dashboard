import { z } from "zod";

const todoBaseSchema = {
  title: z.string().min(1, "Title is required"),
  isCompleted: z.boolean().optional(),
};

export const todoBodySchema = z.object(todoBaseSchema);

export const todoParamsSchema = z.object({
  todoId: z.string().min(1, "Todo ID is required"),
});

// For creating a new todo
export const createTodoSchema = z.object({
  body: todoBodySchema,
});

// For updating a todo
export const updateTodoSchema = z.object({
  params: todoParamsSchema,
  body: todoBodySchema.partial(),
});

// For deleting a todo
export const deleteTodoSchema = z.object({
  params: todoParamsSchema,
});

export type CreateTodoInput = z.infer<typeof todoBodySchema>;
export type UpdateTodoInput = z.infer<typeof todoBodySchema>;
export type TodoParams = z.infer<typeof todoParamsSchema>;
