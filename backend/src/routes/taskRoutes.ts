import { Router } from "express";

import {
  createTask,
  deleteTask,
  getAllTask,
  getTaskById,
  updateTask,
} from "../controllers/taskController";

const taskRouter = Router();

taskRouter.get("/get/:id", getTaskById);
taskRouter.get("/getAll", getAllTask);
taskRouter.post("/create", createTask);
taskRouter.patch("/update/:id", updateTask);
taskRouter.delete("/delete/:id", deleteTask);

export default taskRouter;
