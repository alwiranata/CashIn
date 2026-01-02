import { Router } from "express";
import authRouter from "./authRoute";
import transactionRouter from "./transactionRoute";
import userRouter from "./userRoutes";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/transaction", transactionRouter);

export default router;
