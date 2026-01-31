import { db } from "../../prisma/index";

export const getTodos = async () => {
  return await db.todo.findMany({});
};

export const createTodo = async (data: {
  title: string;
  isCompleted?: boolean;
}) => {
  return await db.todo.create({
    data,
  });
};

export const updateTodo = async (
  id: string,
  data: {
    title: string;
    isCompleted?: boolean;
  },
) => {
  return await db.todo.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteTodo = async (id: string) => {
  return await db.todo.delete({
    where: {
      id,
    },
  });
};
