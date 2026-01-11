import { RequestHandler } from "express";
import {
  createTransactioValidation,
  updateTransactionValidation,
} from "../validations";
import { ZodError } from "zod";
import { prisma } from "../lib/prisma";
import { removeUndefined } from "../utils/removeUndefine";
import { userRequest } from "../types/userRequest";

export const getAllTransaction: RequestHandler = async (req, res) => {
  try {
    const transaction = await prisma.transaction.findMany();

    return res.status(200).json({
      message: "Get all data sucessfully",
      data: transaction,
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

export const getTransationById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Transaction ID is Required",
      });
    }

    const idNumber = Number(id);

    const findtansaction = await prisma.transaction.findUnique({
      where: {
        id: idNumber,
      },
    });

    if (!findtansaction) {
      return res.status(404).json({
        message: "Transaction Not Found",
      });
    }

    return res.status(200).json({
      message: `Get data id ${findtansaction.id} successfully`,
      data: findtansaction,
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
      message: "internal server error",
    });
  }
};

export const createTransaction: RequestHandler = async (req, res) => {
  try {
    const userReq = req as userRequest;

    const validated = createTransactioValidation.parse(userReq.body);

    const transaction = await prisma.transaction.create({
      data: {
        nameTransaction: validated.nameTransaction,
        price: validated.price,
        typeTransaction: validated.typeTransaction,
        image: validated.image || "",
        transactionDate: validated.transactionDate ?? new Date(),
        createdById: userReq.user.id,
      },
    });

    return res.status(201).json({
      message: "Transaction created successfully",
      data: transaction,
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

export const updateTransaction: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Transaction ID is required",
      });
    }
    
    const idNumber = Number(id);
    
    const findTransaction = await prisma.transaction.findUnique({
      where: {
        id: idNumber,
      },
    });
    
    if (!findTransaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    const validated = updateTransactionValidation.parse(req.body);
    
    const data = removeUndefined(validated);

    const updateTransaction = await prisma.transaction.update({
      where: {
        id: idNumber,
      },

      data: data,
    });

    res.status(200).json({
      message: "Transaction update successfully",
      data: updateTransaction,
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

export const deleteTransaction: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Transaction ID is Requiered",
      });
    }

    const idNumber = Number(id);

    const findTransaction = await prisma.transaction.findUnique({
      where: {
        id: idNumber,
      },
    });

    if (!findTransaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    const deleteTransaction = await prisma.transaction.delete({
      where: {
        id: idNumber,
      },
    });

    res.status(200).json({
      message: "Transaction delete successfully",
      data: {
        transaction: deleteTransaction,
      },
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
      message: "Internal Server Error",
      error: error,
    });
  }
};
