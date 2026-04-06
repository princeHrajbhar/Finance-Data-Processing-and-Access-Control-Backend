import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/errorMiddleware.js";

import authRoutes from "./modules/auth/auth.route.js";
import transactionRoutes from "./modules/transaction/transaction.route.js";
import userRoutes from "./modules/admin/user.route.js";   
import dashboardRoutes from "./modules/dashboard/dashboard.route.js";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Health
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "Server is up" });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "Server is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes); // 

// Global Error Handler
app.use(globalErrorHandler);

export default app;