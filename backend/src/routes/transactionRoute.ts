import { Router } from "express";
import { createTransaction } from "../controllers/transactionController";

const transactionRouter = Router();

transactionRouter.post("/create", createTransaction);

export default transactionRouter;
