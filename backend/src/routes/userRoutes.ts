import { Router } from "express";

import {
  createUser,
  getAllUser,
  getUserEmail,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/getEmail", getUserEmail);
userRouter.get("/getAll", getAllUser);
userRouter.post("/create", createUser);
export default userRouter;
