import { Request, Response } from "express";
import {
  createTransactioValidation,
  updateTransactionValidation,
} from "../validations";
import { ZodError } from "zod";
import { prisma } from "../lib/prisma";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const validated = createTransactioValidation.parse(req.body);

    const transaction = await prisma.transaction.create({
      data: {
        nameTransaction: validated.nameTransaction,
        price: validated.price,
        typeTransaction: validated.typeTransaction,
        transactionDate: validated.transactionDate ?? new Date(),
        createdBy: 12,
      },
    });

    return res.status(201).json({
      message: "Transaction created successfully",
      data: {
        idTransaction: transaction.id,
        nameTransaction: transaction.nameTransaction,
        price: transaction.price,
        typeTransaction: transaction.typeTransaction,
        transactionDate: transaction.transactionDate,
        createdBy: transaction.createdBy,
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

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Transaction ID is required",
      });
    }
    const validated = updateTransactionValidation.parse(req.body);

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

    const updateTransaction = await prisma.transaction.update({
      where: {
        id: idNumber,
      },

      data: {
        ...(validated.nameTransaction && {
          nameTransaction: validated.nameTransaction,
        }),
        ...(validated.price !== undefined && {
          price: validated.price,
        }),
        ...(validated.typeTransaction && {
          typeTransaction: validated.typeTransaction,
        }),
        ...(validated.transactionDate && {
          transactionDate: validated.transactionDate,
        }),
      },
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

export const deleteTransaction = async (req: Request, res: Response) => {
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
