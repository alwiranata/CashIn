import { Router } from "express";

import {
  createTask,
  getAllTask,
  getTaskById,
  updateTask,
} from "../controllers/taskController";

const taskRouter = Router();

taskRouter.get("/get/:id", getTaskById);
taskRouter.get("/getAll", getAllTask);
taskRouter.post("/create", createTask);
taskRouter.patch("/update/:id", updateTask);

export default taskRouter;
