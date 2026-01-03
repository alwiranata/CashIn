import { Router } from "express";

import { getAllUser, getUserEmail } from "../controllers/userController";

const userRouter = Router();

userRouter.get("/getEmail", getUserEmail);
userRouter.get("/getAll", getAllUser);

export default userRouter;
