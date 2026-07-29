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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ===============================
// UPLOADS
// ===============================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ===============================
// ROOT ROUTE
// ===============================

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Iteme of Hope Family Organization API is running",
  });
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    name: "Iteme of Hope Family Organization API",
  });
});

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/children", childrenRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/donations", donationsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/charity-weeks", charityWeekRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/stats", statsRoutes);

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Iteme of Hope Family Organization API running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
};

startServer();