import express, { type Router } from "express";
import { validateRequest } from "../../modules/validate";
import * as todoController from "../../modules/todo/todo.controller";
import {
  createTodoSchema,
  updateTodoSchema,
  deleteTodoSchema,
} from "../../modules/todo/todo.validation";

const router: Router = express.Router();

// Create a new todo
router.post("/", validateRequest(createTodoSchema), todoController.createTodo);

// Get all todos
router.get("/", todoController.getTodos);

// Update a todo
router.put(
  "/:todoId",
  validateRequest(updateTodoSchema),
  todoController.updateTodo,
);

// Delete a todo
router.delete(
  "/:todoId",
  validateRequest(deleteTodoSchema),
  todoController.deleteTodo,
);

export default router;
