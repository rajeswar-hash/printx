import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

export const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "printx-server" });
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
