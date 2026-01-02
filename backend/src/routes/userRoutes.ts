import { Router } from "express";

import { getUserEmail } from "../controllers/userController";

const userRouter = Router();

userRouter.get("/getEmail", getUserEmail);

export default userRouter;
