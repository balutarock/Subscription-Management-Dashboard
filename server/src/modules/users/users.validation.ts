import { z } from "zod";

export const createUserValidation = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const CreateUserValidation = z.object({
  body: createUserValidation,
});

export const loginValidation = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const LoginUserValidation = z.object({
  body: loginValidation,
});

export type CreateUserInput = z.infer<typeof createUserValidation>;
export type LoginUserInput = z.infer<typeof loginValidation>;
