import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import Staff from "../models/Staff.js";

const router = express.Router();

// =========================================================
// PATH
// =========================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// =========================================================
// MULTER
// =========================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed."
        )
      );
    }
  },
});

// =========================================================
// DELETE IMAGE
// =========================================================

function deleteImage(image) {
  if (!image) return;

  if (!image.startsWith("/uploads/")) return;

  const filename = path.basename(image);
  const imagePath = path.join(uploadDir, filename);

  if (fs.existsSync(imagePath)) {
    try {
      fs.unlinkSync(imagePath);
    } catch (error) {
      console.error(
        "IMAGE DELETE ERROR:",
        error.message
      );
    }
  }
}

// =========================================================
// GET ALL
// =========================================================

router.get("/", async (req, res) => {
  try {
    const staff = await Staff.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(staff);
  } catch (error) {
    console.error("GET STAFF ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load staff.",
      error: error.message,
    });
  }
});

// =========================================================
// GET ONE
// =========================================================

router.get("/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found.",
      });
    }

    return res.status(200).json(staff);
  } catch (error) {
    console.error("GET STAFF BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load staff member.",
      error: error.message,
    });
  }
});

// =========================================================
// CREATE
// =========================================================

router.post("/", (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      console.error("========== MULTER ERROR ==========");
      console.error(error);
      console.error("===================================");

      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "Image must be less than 5MB.",
          });
        }

        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message || "Image upload failed.",
      });
    }

    next();
  });
}, async (req, res) => {
  try {
    console.log("");
    console.log("======================================");
    console.log("CREATE STAFF");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("======================================");

    const name = req.body?.name;
    const role = req.body?.role;
    const bio = req.body?.bio;
    const email = req.body?.email;

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!name || !String(name).trim()) {
      if (req.file) {
        deleteImage(`/uploads/${req.file.filename}`);
      }

      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (!role || !String(role).trim()) {
      if (req.file) {
        deleteImage(`/uploads/${req.file.filename}`);
      }

      return res.status(400).json({
        success: false,
        message: "Role is required.",
      });
    }

    if (!bio || !String(bio).trim()) {
      if (req.file) {
        deleteImage(`/uploads/${req.file.filename}`);
      }

      return res.status(400).json({
        success: false,
        message: "Bio is required.",
      });
    }

    // -------------------------------------------------------
    // IMAGE
    // -------------------------------------------------------

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    // -------------------------------------------------------
    // CREATE
    // -------------------------------------------------------

    const staff = await Staff.create({
      name: String(name).trim(),
      role: String(role).trim(),
      bio: String(bio).trim(),
      email: email ? String(email).trim() : "",
      image,
    });

    console.log("STAFF CREATED:", staff._id);

    return res.status(201).json(staff);
  } catch (error) {
    console.error("========== CREATE STAFF ERROR ==========");
    console.error(error);
    console.error("========================================");

    if (req.file) {
      deleteImage(`/uploads/${req.file.filename}`);
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (item) => item.message
      );

      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create staff.",
    });
  }
});

// =========================================================
// UPDATE
// =========================================================

router.put("/:id", (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      console.error("MULTER UPDATE ERROR:", error);

      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "Image must be less than 5MB.",
          });
        }

        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message || "Image upload failed.",
      });
    }

    next();
  });
}, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      if (req.file) {
        deleteImage(`/uploads/${req.file.filename}`);
      }

      return res.status(404).json({
        success: false,
        message: "Staff member not found.",
      });
    }

    const {
      name,
      role,
      bio,
      email,
    } = req.body;

    if (name !== undefined) {
      if (!String(name).trim()) {
        if (req.file) {
          deleteImage(`/uploads/${req.file.filename}`);
        }

        return res.status(400).json({
          success: false,
          message: "Name is required.",
        });
      }

      staff.name = String(name).trim();
    }

    if (role !== undefined) {
      if (!String(role).trim()) {
        if (req.file) {
          deleteImage(`/uploads/${req.file.filename}`);
        }

        return res.status(400).json({
          success: false,
          message: "Role is required.",
        });
      }

      staff.role = String(role).trim();
    }

    if (bio !== undefined) {
      staff.bio = String(bio).trim();
    }

    if (email !== undefined) {
      staff.email = String(email).trim();
    }

    if (req.file) {
      if (staff.image) {
        deleteImage(staff.image);
      }

      staff.image = `/uploads/${req.file.filename}`;
    }

    await staff.save();

    return res.status(200).json(staff);
  } catch (error) {
    console.error("UPDATE STAFF ERROR:", error);

    if (req.file) {
      deleteImage(`/uploads/${req.file.filename}`);
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (item) => item.message
      );

      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update staff.",
    });
  }
});

// =========================================================
// DELETE
// =========================================================

router.delete("/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found.",
      });
    }

    if (staff.image) {
      deleteImage(staff.image);
    }

    await Staff.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Staff member deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE STAFF ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete staff.",
    });
  }
});

export default router;