import { z } from "zod";

export const createTaskValidation = z.object({
  nameTask: z.string().min(1, "Name transaction is required"),
  image: z.string().optional(),
  startTask: z.coerce.date().optional(),
  finishTask: z.coerce.date().optional(),
  statusTask: z.enum(["PENDING", "PROGRESS", "DONE"]),
});

export const updateTaskValidation = z.object({
  nameTask: z.string().min(1, "Name transaction is required").optional(),
  image: z.string().optional(),
  startTask: z.coerce.date().optional(),
  finishTask: z.coerce.date().optional(),
  statusTask: z.enum(["PENDING", "PROGRESS", "DONE"]).optional(),
});
