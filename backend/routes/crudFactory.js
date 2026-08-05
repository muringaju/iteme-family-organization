import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// ======================================================
// MODELS
// ======================================================

import Child from "../models/Child.js";
import Staff from "../models/Staff.js";
import Member from "../models/Member.js";
import Donation from "../models/Donation.js";
import Report from "../models/Report.js";
import CharityWeek from "../models/CharityWeek.js";
import Message from "../models/Message.js";

// ======================================================
// MODEL MAP
// ======================================================

const models = {
  children: Child,
  staff: Staff,
  members: Member,
  donations: Donation,
  reports: Report,
  charityWeeks: CharityWeek,
  messages: Message,
};

// ======================================================
// UPLOAD DIRECTORY
// ======================================================

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ======================================================
// MULTER CONFIGURATION
// ======================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const filename = `${file.fieldname}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

// ======================================================
// VALIDATION ERROR HELPER
// ======================================================

function getValidationMessage(error) {
  if (error.name !== "ValidationError") {
    return null;
  }

  return Object.values(error.errors)
    .map((err) => err.message)
    .join(", ");
}

// ======================================================
// CRUD ROUTER FACTORY
// ======================================================

export function buildCrudRouter(
  resource,
  {
    withImage = false,
    publicRead = false,
    protectUpdate = null,
    protectDelete = null,
  } = {}
) {
  const router = express.Router();

  const Model = models[resource];

  // ====================================================
  // CHECK MODEL
  // ====================================================

  if (!Model) {
    throw new Error(
      `No Mongoose model configured for resource: ${resource}`
    );
  }

  // ====================================================
  // GET ALL
  // ====================================================

  router.get("/", async (req, res) => {
    try {
      const records = await Model.find().sort({
        createdAt: -1,
      });

      return res.status(200).json(records);
    } catch (error) {
      console.error(`GET ${resource} ERROR:`, error);

      return res.status(500).json({
        success: false,
        message: "Could not load records.",
      });
    }
  });

  // ====================================================
  // GET ONE
  // ====================================================

  router.get("/:id", async (req, res) => {
    try {
      const record = await Model.findById(req.params.id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Record not found.",
        });
      }

      return res.status(200).json(record);
    } catch (error) {
      console.error(
        `GET ONE ${resource} ERROR:`,
        error
      );

      return res.status(500).json({
        success: false,
        message: "Could not load record.",
      });
    }
  });

  // ====================================================
  // CREATE
  // ====================================================

  const createHandler = async (req, res) => {
    try {
      const data = {
        ...req.body,
      };

      // Add uploaded image
      if (withImage && req.file) {
        data.image = `/uploads/${req.file.filename}`;
      }

      const record = await Model.create(data);

      return res.status(201).json(record);
    } catch (error) {
      console.error(
        `CREATE ${resource} ERROR:`,
        error
      );

      const validationMessage =
        getValidationMessage(error);

      if (validationMessage) {
        return res.status(400).json({
          success: false,
          message: validationMessage,
        });
      }

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Could not create record.",
      });
    }
  };

  if (withImage) {
    router.post(
      "/",
      upload.single("image"),
      createHandler
    );
  } else {
    router.post("/", createHandler);
  }

  // ====================================================
  // UPDATE
  // ====================================================

  const updateHandler = async (req, res) => {
    try {
      const data = {
        ...req.body,
      };

      // Prevent modification of MongoDB internal fields
      delete data._id;
      delete data.id;
      delete data.__v;
      delete data.createdAt;
      delete data.updatedAt;

      // Update image only when a new image is provided
      if (withImage && req.file) {
        data.image = `/uploads/${req.file.filename}`;
      }

      const record = await Model.findByIdAndUpdate(
        req.params.id,
        data,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Record not found.",
        });
      }

      return res.status(200).json(record);
    } catch (error) {
      console.error(
        `UPDATE ${resource} ERROR:`,
        error
      );

      const validationMessage =
        getValidationMessage(error);

      if (validationMessage) {
        return res.status(400).json({
          success: false,
          message: validationMessage,
        });
      }

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Could not update record.",
      });
    }
  };

  // Apply update protection when provided
  const updateMiddleware = protectUpdate
    ? [protectUpdate]
    : [];

  if (withImage) {
    router.put(
      "/:id",
      ...updateMiddleware,
      upload.single("image"),
      updateHandler
    );
  } else {
    router.put(
      "/:id",
      ...updateMiddleware,
      updateHandler
    );
  }

  // ====================================================
  // DELETE
  // ====================================================

  const deleteHandler = async (req, res) => {
    try {
      const record = await Model.findByIdAndDelete(
        req.params.id
      );

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Record not found.",
        });
      }

      // Delete associated image
      if (withImage && record.image) {
        const imageName = path.basename(record.image);

        const imagePath = path.join(
          uploadDir,
          imageName
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Record deleted successfully.",
      });
    } catch (error) {
      console.error(
        `DELETE ${resource} ERROR:`,
        error
      );

      return res.status(500).json({
        success: false,
        message: "Could not delete record.",
      });
    }
  };

  // Apply delete protection when provided
  const deleteMiddleware = protectDelete
    ? [protectDelete]
    : [];

  router.delete(
    "/:id",
    ...deleteMiddleware,
    deleteHandler
  );

  // ====================================================
  // RETURN ROUTER
  // ====================================================

  return router;
}

