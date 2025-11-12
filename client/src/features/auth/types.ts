import { z } from "zod";
import validator from "validator";

const passwordValidationSchema = (fieldName: string) =>
  z
    .string({ error: `${fieldName} is required` })
    .min(8, { message: "Password must contain at least 8 character(s)" })
    .max(64)
    .refine(
      (value) =>
        validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minNumbers: 1,
          minUppercase: 1,
          minSymbols: 1,
        }),
      "Password must contain at least one upppercase, lowercase, number and symbol"
    );

export const ZRegister = z.object({
  email: z
    .string({ error: "Email is required" })
    .email({ error: "Invalid email" })
    .max(100),
  password: passwordValidationSchema("Password"),
  name: z
    .string({ error: "First name is required" })
    .min(1, { error: "First name is required" })
    .max(100, { error: "First name is too long" })
    .transform((val) => val.trim()),
});

export const ZRegisterConfirmPassword = z.object({
  confirmPassword: passwordValidationSchema("Password"),
});

export type TRegister = z.infer<typeof ZRegister>;

export interface UserRoles {
  admin: string;
  user: string;
}
