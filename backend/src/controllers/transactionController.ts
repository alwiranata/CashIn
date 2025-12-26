import { Request, Response } from "express";
import { createTransactioValidation } from "../validations";
import { date, ZodError } from "zod";
import { prisma } from "../lib/prisma";
import { typeTransaction } from "@prisma/client";

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
