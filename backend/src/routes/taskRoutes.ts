import { Router } from "express";

import { createTask, getAllTask } from "../controllers/taskController";

const taskRouter = Router();

taskRouter.get("/getAll", getAllTask);
taskRouter.post("/create", createTask);

export default taskRouter;
