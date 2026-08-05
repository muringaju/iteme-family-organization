import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

// =====================================================
// JWT SECRET
// =====================================================

const getJwtSecret = () => {
  return (
    process.env.JWT_SECRET ||
    "ItemeFamilyOrganizationSuperSecretKey2026"
  );
};

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // -----------------------------------------------
    // FIND ADMIN
    // -----------------------------------------------

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // -----------------------------------------------
    // CHECK PASSWORD
    // -----------------------------------------------

    const passwordMatches = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // -----------------------------------------------
    // CREATE JWT
    // -----------------------------------------------

    const token = jwt.sign(
      {
        id: admin._id.toString(),
        email: admin.email,
        role: admin.role,
      },
      getJwtSecret(),
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,

      admin: {
        id: admin._id,
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

// =====================================================
// CHECK AUTHENTICATION
// POST /api/auth/me
// =====================================================

router.get("/me", async (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      "Authentication route is working.",
  });
});

export default router;

