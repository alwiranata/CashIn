import { RequestHandler } from "express";
import {  ZodError } from "zod";

export const createTask: RequestHandler = async (req, res) => {
  try {
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
