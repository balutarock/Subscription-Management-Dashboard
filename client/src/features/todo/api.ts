// client/src/features/todo/api.ts
import axios from "axios";
import type { CreateTodoInput, UpdateTodoInput } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL!;

// Get all todos
export const getTodos = async () => {
  const response = await axios.get(`${BASE_URL}/api/todo`);
  return response.data;
};

// Create a new todo
export const createTodo = async (data: CreateTodoInput) => {
  const response = await axios.post(`${BASE_URL}/api/todo`, data);
  return response.data;
};

// Update a todo
export const updateTodo = async (id: string, data: UpdateTodoInput) => {
  const response = await axios.put(`${BASE_URL}/api/todo/${id}`, data);
  return response.data;
};

// Delete a todo
export const deleteTodo = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/api/todo/${id}`);
  return response.data;
};
