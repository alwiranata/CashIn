import { Router } from "express";
import {
  createTransaction,
  updateTransaction,
} from "../controllers/transactionController";

const transactionRouter = Router();

transactionRouter.post("/create", createTransaction);
transactionRouter.patch("/update/:id", updateTransaction);


export default transactionRouter;
