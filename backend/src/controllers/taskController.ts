import { RequestHandler } from "express";
import { ZodError } from "zod";
import { userRequest } from "../types/userRequest";
import {
  createTaskValidation,
  updateTaskValidation,
} from "../validations/taskValidation";
import { prisma } from "../lib/prisma";
import { removeUndefined } from "../utils/removeUndefine";

export const getTaskById: RequestHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid Task Id",
      });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: id,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: `Get task id ${id} successfully`,
      data: task,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        error: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllTask: RequestHandler = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();

    return res.status(200).json({
      message: "Get all task successfully",
      data: tasks,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation Error",
        error: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const createTask: RequestHandler = async (req, res) => {
  try {
    const userReq = req as userRequest;

    const validated = createTaskValidation.parse(userReq.body);

    const task = await prisma.task.create({
      data: {
        nameTask: validated.nameTask,
        image: validated.image || "",
        statusTask: validated.statusTask,
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
    console.log(error);
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation Error",
        error: error.issues.map((err) => ({
          field: err.path.join,
          message: err.message,
        })),
      });
    }
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateTask: RequestHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Task Id is required",
      });
    }
    const findtask = await prisma.task.findUnique({
      where: {
        id: id,
      },
    });

    if (!findtask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const validate = await updateTaskValidation.parse(req.body);

    const data = removeUndefined(validate);
    const updateTask = await prisma.task.update({
      where: {
        id: id,
      },

      data: data,
    });

    return res.status(200).json({
      message: "Created task successfully",
      data: updateTask,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        error: error.issues.map((err) => ({
          field: err.path.join("."),
          mesaage: err.message,
        })),
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteTask: RequestHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Task Id is Required",
      });
    }

    const findTask = await prisma.task.findUnique({
      where: {
        id: id,
      },
    });

    if (!findTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const task = await prisma.task.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "Delete task successfully",
      data: task,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        error: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
