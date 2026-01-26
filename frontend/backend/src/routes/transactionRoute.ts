import { Router } from "express";
import {
  getTransationById,
  getAllTransaction,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../controllers/transactionController";

const transactionRouter = Router();

transactionRouter.get("/get/:id", getTransationById);
transactionRouter.get("/getAll", getAllTransaction);
transactionRouter.post("/create", createTransaction);
transactionRouter.patch("/update/:id", updateTransaction);
transactionRouter.delete("/delete/:id", deleteTransaction);

export default transactionRouter;
