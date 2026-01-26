import { Router } from "express";
import { register, login, activateToken } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/activate/:token", activateToken);

export default authRouter;
