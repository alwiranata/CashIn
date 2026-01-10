import { Router } from "express";

import {
  createUser,
  getAllUser,
  getUserByEmail,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/getEmail", getUserByEmail);
userRouter.get("/getAll", getAllUser);
userRouter.post("/create", createUser);
userRouter.patch("/update/:id", updateUser);
userRouter.delete("/delete/:id", deleteUser);

export default userRouter;
