import { Router } from "express";
import { jwtMiddleware } from "../middlewares/jwtMiddleware";
import authRouter from "./authRoute";
import transactionRouter from "./transactionRoute";
import userRouter from "./userRoutes";
import taskRouter from "./taskRoutes";
import dashboardRouter from "./dashboardRoute";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", jwtMiddleware, userRouter);
router.use("/transaction", jwtMiddleware, transactionRouter);
router.use("/dashboard", jwtMiddleware, dashboardRouter);
router.use("/task", jwtMiddleware, taskRouter);

export default router;
