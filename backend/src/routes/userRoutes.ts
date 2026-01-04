import { Router } from "express";

import {
  createUser,
  getAllUser,
  getUserEmail,
  updateUser,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/getEmail", getUserEmail);
userRouter.get("/getAll", getAllUser);
userRouter.post("/create", createUser);
userRouter.patch("/update/:id", updateUser);

export default userRouter;
