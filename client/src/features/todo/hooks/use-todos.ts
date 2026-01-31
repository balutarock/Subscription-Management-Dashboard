/* eslint-disable @typescript-eslint/no-explicit-any */
// client/src/features/todo/hooks/use-todos.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../api";
import {
  type CreateTodoInput,
  type UpdateTodoInput,
  type Todo,
} from "../types";
import { toast } from "sonner";
import { useState } from "react";

export function useTodos() {
  const queryClient = useQueryClient();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Get all todos
  const { data: todos = { data: [] }, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  // Create todo mutation
  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo created successfully");
    },
    onError: (error: any) => {
      console.error("Create todo error:", error);
      const message = error.response?.data?.message || "Failed to create todo";
      toast.error(message);
    },
  });

  // Update todo mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoInput }) =>
      updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setEditingTodo(null);
      toast.success("Todo updated successfully");
    },
    onError: (error: any) => {
      console.error("Update todo error:", error);
      const message = error.response?.data?.message || "Failed to update todo";
      toast.error(message);
    },
  });

  // Delete todo mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete todo error:", error);
      const message = error.response?.data?.message || "Failed to delete todo";
      toast.error(message);
    },
  });

  const handleSubmit = (data: CreateTodoInput) => {
    if (editingTodo) {
      updateMutation.mutate({ id: editingTodo.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return {
    todos,
    isLoading,
    createTodo: (data: CreateTodoInput) => createMutation.mutate(data),
    updateTodo: (id: string, data: UpdateTodoInput) =>
      updateMutation.mutate({ id, data }),
    deleteTodo: (id: string) => deleteMutation.mutate(id),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    editingTodo,
    setEditingTodo,
    resetEditing: () => setEditingTodo(null),
    handleSubmit,
  };
}
