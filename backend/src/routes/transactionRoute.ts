import { Router } from "express";
import {
  getTransation,
  getAllTransaction,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../controllers/transactionController";

const transactionRouter = Router();

transactionRouter.get("/get/:id", getTransation);
transactionRouter.get("/getAll", getAllTransaction);
transactionRouter.post("/create", createTransaction);
transactionRouter.patch("/update/:id", updateTransaction);
transactionRouter.delete("/delete/:id", deleteTransaction);

export default transactionRouter;
