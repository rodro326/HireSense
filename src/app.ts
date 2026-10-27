
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to HireSense API!",
  });
});

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "HireSense API is healthy",
    timestamp: new Date().toISOString(),
  });
});

export default app;
