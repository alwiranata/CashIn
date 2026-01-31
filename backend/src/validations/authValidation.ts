import z from "zod";

export const registerValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginValidation = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(1, "Password is required"), // Pesan ini yang akan muncul
});
