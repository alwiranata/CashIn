import { Router } from "express";

import { createTask } from "../controllers/taskController";

const taskRouter = Router();

taskRouter.post("/create", createTask);

export default taskRouter;
