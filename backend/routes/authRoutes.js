
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

import { db } from "../config/db.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ===============================
// CREATE JWT TOKEN
// ===============================
function signToken(admin) {
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
    secretKey,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
}

// ===============================
// POST /api/auth/login
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    await db.read();

    // Make sure admins exists
    if (!db.data) {
      db.data = {};
    }

    if (!db.data.admins) {
      db.data.admins = [];
    }

    // Find admin
    const admin = db.data.admins.find(
      (a) =>
        a.email &&
        a.email.toLowerCase() === email.toLowerCase()
    );

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check password
    const match = await bcrypt.compare(
      password,
      admin.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Create token
    const token = signToken(admin);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
});

// ===============================
// GET /api/auth/me
// ===============================
router.get("/me", protect, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      admin: req.admin,
    });
  } catch (error) {
    console.error("ME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get admin information.",
    });
  }
});

// ===============================
// POST /api/auth/register
// ===============================
router.post("/register", protect, async (req, res) => {
  try {
    // Only superadmin can create accounts
    if (req.admin.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message:
          "Only a super admin can add new admin accounts.",
      });
    }

    const {
      name,
      email,
      password,
      role,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    await db.read();

    if (!db.data) {
      db.data = {};
    }

    if (!db.data.admins) {
      db.data.admins = [];
    }

    // Check existing email
    const exists = db.data.admins.find(
      (a) =>
        a.email &&
        a.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message:
          "An admin with this email already exists.",
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create admin
    const newAdmin = {
      id: uuid(),
      name,
      email: email.toLowerCase(),
      password: hashed,
      role:
        role === "superadmin"
          ? "superadmin"
          : "admin",
      createdAt: new Date().toISOString(),
    };

    db.data.admins.push(newAdmin);

    await db.write();

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully.",
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
    });
  }
});

export default router;

