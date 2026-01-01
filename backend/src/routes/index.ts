import { Router } from "express";
import authRouter from "./authRoute";
import transactionRouter from "./transactionRoute";

const router = Router();

router.use("/auth", authRouter);
router.use("/transaction", transactionRouter);


export default router;
