import jwt from "jsonwebtoken";

export function protect(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized. Please log in." });
  }

  const token = header.split(" ")[1];

  try {
    // 🚀 THE CRITICAL FIX: Added a strong fallback key matching your authRoutes file perfectly
    const secretKey = process.env.JWT_SECRET || "ItemeFamilyOrganizationSuperSecretKey2026";
    
    const decoded = jwt.verify(token, secretKey);
    req.admin = decoded;
    next(); // Pass safely to creation logic
  } catch (err) {
    console.error("[AUTH ERROR] Token verification failed:", err.message);
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
}
