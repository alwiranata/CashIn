import express from "express";
import dotenv from "dotenv";
import type { Request, Response } from "express";

dotenv.config();
export const app = express();
export const PORT = Number(process.env.PORT) || 3001;

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Get Data",
  });
});
