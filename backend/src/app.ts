import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import router from "./routes";
export const app = express();
export const PORT = Number(process.env.PORT) || 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api", router);

export default app;
