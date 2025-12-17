import z from "zod";

export const Register = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const Login = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});
