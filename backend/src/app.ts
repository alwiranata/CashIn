import express from "express";
import dotenv from "dotenv";
import router from "./routes";

dotenv.config();
export const app = express();
export const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());
app.use("/api", router);

export default app
