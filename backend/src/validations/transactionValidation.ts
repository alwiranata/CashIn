import z from "zod";

export const createTransactioValidation = z.object({
  nameTransaction: z.string().min(1, "Name transaction is required"),
  price: z.number().int().positive("Price must be greater than 0"),
  transactionDate: z.coerce.date().optional(),
  typeTransaction: z.enum(["INCOME", "EXPENSE"]),
});

export const updateTransactionValidation = z.object({
  nameTransaction: z.string().min(1, "Name transaction is required").optional(),
  price: z.number().int().positive("Price must be greater than 0").optional(),
  transactionDate: z.coerce.date().optional(),
  typeTransaction: z.enum(["INCOME", "EXPENSE"]).optional(),
});
