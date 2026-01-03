import { Request, Response } from "express";
import { ZodError } from "zod";
import { prisma } from "../lib/prisma";
import { getUserEmailValidation, createUserValidation } from "../validations";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const getUserEmail = async (req: Request, res: Response) => {
  try {
    const findEmail = getUserEmailValidation.parse(req.body);
    if (!findEmail) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: findEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: `Get user ${user.email} sucessfully`,
      data: user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findMany();

    return res.status(200).json({
      messsage: "Get all data sucessfully",
      data: user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.json(400).json({
        message: "Validation Error",
        errro: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const validated = createUserValidation.parse(req.body);

    //Unique Email
    const existingEmail = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }
    //hash pasword
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: validated.role || "USER",
        status: validated.status || "NONACTIVE",
      },
    });

    return res.status(200).json({
      message: "User created sucessfully",
      data: user,
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
      message: "Internal Server Error",
    });
  }
};
