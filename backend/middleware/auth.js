import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in.",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const secretKey =
      process.env.JWT_SECRET ||
      "ItemeFamilyOrganizationSuperSecretKey2026";

    const decoded = jwt.verify(
      token,
      secretKey
    );

    const admin = await Admin.findById(
      decoded.id
    ).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired login session.",
    });
  }
};