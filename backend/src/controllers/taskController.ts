import { RequestHandler } from "express";
import { json, ZodError } from "zod";
import { userRequest } from "../types/userRequest";
import { createTaskValidation } from "../validations/taskValidation";
import { prisma } from "../lib/prisma";

export const createTask: RequestHandler = async (req, res) => {
  try {
    const userReq = req as userRequest;

    const validated = createTaskValidation.parse(userReq.body);

    const task = await prisma.task.create({
      data: {
        nameTask: validated.nameTask,
        image: validated.image || "",
        statusTask: validated.statusTask ,
        startTask: validated.startTask ?? new Date(),
        finishTask: validated.finishTask ?? new Date(),
        createdById: userReq.user.id,
      },
    });

    return res.status(201).json({
      message: "Task created successfullly",
      data: task,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation Error",
        error: error.issues.map((err) => ({
          field: err.path.join,
          message: err.message,
        })),
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
