import { db } from "../../prisma";
import { CreateUserInput } from "./users.validation";

export const getUserById = async (id: string) => {
  return await db.user.findUnique({
    where: {
      id,
    },
  });
};

export const getUserByEmail = async (email: string) => {
  return await db.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (user: CreateUserInput) => {
  return await db.user.create({
    data: user,
  });
};
