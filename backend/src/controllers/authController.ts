import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { registerValidation, loginValidation } from "../validations";
import bcrypt from "bcrypt";
import { email, ZodError } from "zod";

export const register = async (req: Request, res: Response) => {
  try {
    //1.validate input
    const validated = registerValidation.parse(req.body);

    //2.check unique email
    const existingEmail = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    //3.hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    //4.save user
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
      },
    });

    //5.response
    return res.status(201).json({
      message: "Regsiter Succes",
      data: {
        user: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  } catch (error) {
    //zod error
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
    // server error
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validated = loginValidation.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Email or password is incorect",
      });
    }

    if (user.status === "NONACTIVE") {
      return res.status(403).json({
        message: "Account is not active. Please contact admin",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      validated.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email or password incorect",
      });
    }

    return res.status(200).json({
      message: "Login success",
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });

  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.issues.map((err) => ({
          field: err.path.join("."),
          error: error,
        })),
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};
