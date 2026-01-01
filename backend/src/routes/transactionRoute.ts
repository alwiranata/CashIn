import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../controllers/transactionController";

const transactionRouter = Router();

transactionRouter.post("/create", createTransaction);
transactionRouter.patch("/update/:id", updateTransaction);
transactionRouter.delete("/delete/:id", deleteTransaction);

export default transactionRouter;
