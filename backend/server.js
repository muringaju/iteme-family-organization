import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import { initDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import childrenRoutes from "./routes/childrenRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import membersRoutes from "./routes/membersRoutes.js";
import donationsRoutes from "./routes/donationsRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import charityWeekRoutes from "./routes/charityWeekRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => res.json({ status: "ok", name: "Iteme of Hope Family Organization API" }));

app.use("/api/auth", authRoutes);
app.use("/api/children", childrenRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/donations", donationsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/charity-weeks", charityWeekRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/stats", statsRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Iteme of Hope Family Organization API running on http://localhost:${PORT}`);
  });
});
