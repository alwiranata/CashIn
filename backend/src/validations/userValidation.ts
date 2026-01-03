import z from "zod";

export const createUserValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["USER", "ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "NONACTIVE"]).optional(),
});

export const updateUserValidation = z.object({
  name: z.string().min(1, "Name is required").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "NONACTIVE"]).optional(),
});

export const getUserEmailValidation = z.object({
  email: z.string().email(),
});
