import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController";

const dashboardRouter = Router();

dashboardRouter.get("/summary", getDashboard);

export default dashboardRouter;
