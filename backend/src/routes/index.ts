import { Router } from "express";
import authRouter from "./authRoute";
import transactionRouter from "./transactionRoute";
import userRouter from "./userRoutes";
import { jwtMiddleware } from "../middlewares/jwtMiddleware";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", jwtMiddleware, userRouter);
router.use("/transaction", jwtMiddleware, transactionRouter);

export default router;
