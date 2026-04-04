import express from "express";
import cors from "cors";

import userRoutes from "./modules/dashboard/dashboard.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Modern API running 🚀" });
});

app.use("/api/users", userRoutes);

export default app;