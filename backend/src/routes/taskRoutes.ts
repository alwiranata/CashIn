import { Router } from "express";

import {
  createTask,
  getAllTask,
  getTaskById,
} from "../controllers/taskController";

const taskRouter = Router();

taskRouter.get("/get/:id", getTaskById);
taskRouter.get("/getAll", getAllTask);
taskRouter.post("/create", createTask);

export default taskRouter;
