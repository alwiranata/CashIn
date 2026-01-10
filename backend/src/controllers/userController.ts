import { RequestHandler } from "express";
import { ZodError } from "zod";
import { prisma } from "../lib/prisma";
import {
  getUserEmailValidation,
  createUserValidation,
  updateUserValidation,
} from "../validations";
import bcrypt from "bcrypt";
import { removeUndefined } from "../utils/removeUndefine";

export const getUserByEmail: RequestHandler = async (req, res) => {
  try {
    const findEmail = getUserEmailValidation.parse(req.query);

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

export const getAllUser: RequestHandler = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    return res.status(200).json({
      messsage: "Get all data sucessfully",
      data: users,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
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

export const createUser: RequestHandler = async (req, res) => {
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

    return res.status(201).json({
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

export const updateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "User ID is Required",
      });
    }

    const userId = Number(id);

    //validate input
    const validate = updateUserValidation.parse(req.body);

    //remove all undefined
    const data = removeUndefined(validate);

    //checking unique email
    if (validate.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: validate.email },
      });

      if (existingEmail && existingEmail.id !== userId) {
        return res.status(400).json({
          message: "Email already registered",
        });
      }
    }

    //hash
    if (validate.password) {
      data.password = await bcrypt.hash(validate.password, 10);
    }

    //update user
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: data,
    });

    return res.status(200).json({
      message: "User update sucessfully ",
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
      message: "Internal server error",
    });
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "User ID is Requiered",
      });
    }

    const userId = Number(id);

    const findUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    //check relation transaction

    const transactionCount = await prisma.transaction.count({
      where: { createdById: userId },
    });

    if (transactionCount > 0) {
      return res.status(409).json({
        message:
          "This user cannot be deleted because they still have transaction",
      });
    }

    const deleteUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res.status(200).json({
      message: "User delete successfully",
      data: {
        user: deleteUser,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        error: error.issues.map((err) => ({
          error: err.path.join("."),
          message: err.message,
        })),
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
