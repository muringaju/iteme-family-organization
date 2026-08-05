
// =====================================================
// ITEME OF HOPE FAMILY ORGANIZATION
// BACKEND SERVER - ES MODULE VERSION
// Node.js 22+
// =====================================================

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";

// =====================================================
// ROUTES
// =====================================================

import authRoutes from "./routes/authRoutes.js";
import childrenRoutes from "./routes/childrenRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import membersRoutes from "./routes/membersRoutes.js";
import donationsRoutes from "./routes/donationsRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import charityWeekRoutes from "./routes/charityWeekRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";

// =====================================================
// ENVIRONMENT
// =====================================================

dotenv.config();

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// CONFIGURATION
// =====================================================

const PORT = process.env.PORT || 5001;

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/iteme_of_hope";

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "*",
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// =====================================================
// UPLOAD DIRECTORIES
// =====================================================

const uploadsDirectory = path.join(
  process.cwd(),
  "uploads"
);

const galleryUploadsDirectory =
  path.join(
    uploadsDirectory,
    "gallery"
  );

// Create directories if they don't exist
if (
  !fs.existsSync(
    galleryUploadsDirectory
  )
) {
  fs.mkdirSync(
    galleryUploadsDirectory,
    {
      recursive: true,
    }
  );
}

// =====================================================
// SERVE UPLOADED FILES
// =====================================================

app.use(
  "/uploads",
  express.static(
    uploadsDirectory
  )
);

// =====================================================
// MULTER STORAGE
// =====================================================

const galleryStorage =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        galleryUploadsDirectory
      );
    },

    filename: (
      req,
      file,
      cb
    ) => {
      const extension =
        path.extname(
          file.originalname
        );

      const safeExtension =
        extension.toLowerCase();

      const filename =
        `gallery-${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${safeExtension}`;

      cb(null, filename);
    },
  });

// =====================================================
// MULTER FILE FILTER
// =====================================================

const galleryUpload =
  multer({
    storage:
      galleryStorage,

    limits: {
      fileSize:
        5 * 1024 * 1024,
    },

    fileFilter: (
      req,
      file,
      cb
    ) => {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];

      if (
        allowedTypes.includes(
          file.mimetype
        )
      ) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Only PNG, JPG, JPEG and WEBP images are allowed."
          )
        );
      }
    },
  });

// =====================================================
// AUTH ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

// =====================================================
// MAIN API ROUTES
// =====================================================

// Children
app.use(
  "/api/children",
  childrenRoutes
);

// Staff
app.use(
  "/api/staff",
  staffRoutes
);

// Members
app.use(
  "/api/members",
  membersRoutes
);

// Donations
app.use(
  "/api/donations",
  donationsRoutes
);

// Reports
app.use(
  "/api/reports",
  reportsRoutes
);

// Charity Week
app.use(
  "/api/charity-weeks",
  charityWeekRoutes
);

// Contact Messages
app.use(
  "/api/messages",
  messagesRoutes
);

// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("");
    console.log(
      "========================================"
    );
    console.log(
      " MongoDB Connected Successfully"
    );
    console.log(
      "========================================"
    );
    console.log("");
  })
  .catch((error) => {
    console.error("");
    console.error(
      "========================================"
    );
    console.error(
      " MongoDB Connection Failed"
    );
    console.error(
      "========================================"
    );
    console.error(
      error.message
    );
    console.error("");
  });

mongoose.connection.on(
  "error",
  (error) => {
    console.error(
      "MongoDB Error:",
      error.message
    );
  }
);

mongoose.connection.on(
  "disconnected",
  () => {
    console.log(
      "MongoDB disconnected"
    );
  }
);

// =====================================================
// GALLERY MODEL
// =====================================================

const gallerySchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      image: {
        type: String,
        required: true,
        trim: true,
      },

      category: {
        type: String,
        default: "Other",
        trim: true,
      },

      date: {
        type: Date,
        default: Date.now,
      },

      visible: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

const Gallery =
  mongoose.models.Gallery ||
  mongoose.model(
    "Gallery",
    gallerySchema
  );

// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "ITEME of HOPE FAMILY ORGANIZATION API is running",
    status: "online",
    port: PORT,
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Server is healthy",

      database:
        mongoose.connection
          .readyState === 1
          ? "connected"
          : "disconnected",

      server: "online",
    });
  }
);

// =====================================================
// AUTH TEST
// =====================================================

app.get(
  "/api/auth/test",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Authentication routes are connected.",
    });
  }
);

// =====================================================
// GALLERY
// =====================================================

// =====================================================
// GET PUBLIC GALLERY
// GET /api/gallery/visible
// =====================================================

app.get(
  "/api/gallery/visible",
  async (req, res) => {
    try {
      const gallery =
        await Gallery.find({
          visible: true,
        }).sort({
          date: -1,
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(
        "PUBLIC GALLERY ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to load our gallery. Please try again.",
      });
    }
  }
);

// =====================================================
// GET ALL GALLERY
// GET /api/gallery
// =====================================================

app.get(
  "/api/gallery",
  async (req, res) => {
    try {
      const gallery =
        await Gallery.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error(
        "GET GALLERY ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to load gallery.",
      });
    }
  }
);

// =====================================================
// GET SINGLE GALLERY
// GET /api/gallery/:id
// =====================================================

app.get(
  "/api/gallery/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid gallery ID.",
        });
      }

      const galleryItem =
        await Gallery.findById(id);

      if (!galleryItem) {
        return res.status(404).json({
          success: false,
          message:
            "Gallery item not found.",
        });
      }

      res.status(200).json({
        success: true,
        data: galleryItem,
      });
    } catch (error) {
      console.error(
        "GET SINGLE GALLERY ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to load gallery item.",
      });
    }
  }
);

// =====================================================
// CREATE GALLERY
// POST /api/gallery
// =====================================================

app.post(
  "/api/gallery",
  galleryUpload.single(
    "image"
  ),
  async (req, res) => {
    try {
      console.log("");
      console.log(
        "========== CREATE GALLERY =========="
      );

      console.log(
        "BODY:",
        req.body
      );

      console.log(
        "FILE:",
        req.file
          ? {
              filename:
                req.file.filename,
              originalname:
                req.file
                  .originalname,
              mimetype:
                req.file.mimetype,
              size:
                req.file.size,
            }
          : "NO FILE"
      );

      console.log(
        "===================================="
      );

      const {
        title,
        description,
        category,
        date,
        visible,
      } = req.body;

      // -------------------------------------------------
      // TITLE
      // -------------------------------------------------

      if (
        !title ||
        !String(title).trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Gallery title is required.",
        });
      }

      // -------------------------------------------------
      // IMAGE
      // -------------------------------------------------

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Gallery image is required.",
        });
      }

      // -------------------------------------------------
      // IMAGE PATH
      // -------------------------------------------------

      const imagePath =
        `/uploads/gallery/${req.file.filename}`;

      // -------------------------------------------------
      // VISIBLE
      // -------------------------------------------------

      const isVisible =
        visible === undefined ||
        visible === "" ||
        visible === true ||
        visible === "true";

      // -------------------------------------------------
      // CREATE
      // -------------------------------------------------

      const galleryItem =
        await Gallery.create({
          title:
            String(
              title
            ).trim(),

          description:
            description
              ? String(
                  description
                ).trim()
              : "",

          image: imagePath,

          category:
            category
              ? String(
                  category
                ).trim()
              : "Other",

          date:
            date || new Date(),

          visible:
            isVisible,
        });

      console.log(
        "Gallery created:",
        galleryItem._id
      );

      res.status(201).json({
        success: true,
        message:
          "Gallery item created successfully.",
        data: galleryItem,
      });
    } catch (error) {
      console.error(
        "CREATE GALLERY ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to create gallery item.",
      });
    }
  }
);

// =====================================================
// UPDATE GALLERY
// PUT /api/gallery/:id
// =====================================================

app.put(
  "/api/gallery/:id",
  galleryUpload.single(
    "image"
  ),
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid gallery ID.",
        });
      }

      const existing =
        await Gallery.findById(id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message:
            "Gallery item not found.",
        });
      }

      const {
        title,
        description,
        category,
        date,
        visible,
      } = req.body;

      // -------------------------------------------------
      // TITLE
      // -------------------------------------------------

      if (
        title !== undefined &&
        !String(title).trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Gallery title is required.",
        });
      }

      const updateData = {};

      // -------------------------------------------------
      // BASIC FIELDS
      // -------------------------------------------------

      if (title !== undefined) {
        updateData.title =
          String(
            title
          ).trim();
      }

      if (
        description !==
        undefined
      ) {
        updateData.description =
          String(
            description
          ).trim();
      }

      if (category !== undefined) {
        updateData.category =
          String(
            category
          ).trim();
      }

      if (date !== undefined) {
        updateData.date =
          date;
      }

      // -------------------------------------------------
      // BOOLEAN
      // -------------------------------------------------

      if (visible !== undefined) {
        updateData.visible =
          visible === true ||
          visible === "true";
      }

      // -------------------------------------------------
      // NEW IMAGE
      // -------------------------------------------------

      if (req.file) {
        updateData.image =
          `/uploads/gallery/${req.file.filename}`;
      }

      // -------------------------------------------------
      // UPDATE
      // -------------------------------------------------

      const updatedGallery =
        await Gallery.findByIdAndUpdate(
          id,
          updateData,
          {
            new: true,
            runValidators: true,
          }
        );

      res.status(200).json({
        success: true,
        message:
          "Gallery item updated successfully.",
        data: updatedGallery,
      });
    } catch (error) {
      console.error(
        "UPDATE GALLERY ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to update gallery item.",
      });
    }
  }
);

// =====================================================
// PATCH VISIBILITY
// PATCH /api/gallery/:id/visibility
// =====================================================

app.patch(
  "/api/gallery/:id/visibility",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const { visible } =
        req.body;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid gallery ID.",
        });
      }

      if (
        typeof visible !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "The visible field must be true or false.",
        });
      }

      const updatedGallery =
        await Gallery.findByIdAndUpdate(
          id,
          {
            visible,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updatedGallery) {
        return res.status(404).json({
          success: false,
          message:
            "Gallery item not found.",
        });
      }

      res.status(200).json({
        success: true,
        message:
          visible
            ? "Gallery item is now visible."
            : "Gallery item is now hidden.",
        data: updatedGallery,
      });
    } catch (error) {
      console.error(
        "VISIBILITY UPDATE ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to update gallery visibility.",
      });
    }
  }
);

// =====================================================
// DELETE GALLERY
// DELETE /api/gallery/:id
// =====================================================

app.delete(
  "/api/gallery/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid gallery ID.",
        });
      }

      const deletedGallery =
        await Gallery.findByIdAndDelete(
          id
        );

      if (!deletedGallery) {
        return res.status(404).json({
          success: false,
          message:
            "Gallery item not found.",
        });
      }

      // -------------------------------------------------
      // DELETE IMAGE FROM SERVER
      // -------------------------------------------------

      if (
        deletedGallery.image &&
        deletedGallery.image.startsWith(
          "/uploads/"
        )
      ) {
        const imageFilePath =
          path.join(
            process.cwd(),
            deletedGallery.image.replace(
              /^\//,
              ""
            )
          );

        if (
          fs.existsSync(
            imageFilePath
          )
        ) {
          fs.unlinkSync(
            imageFilePath
          );
        }
      }

      res.status(200).json({
        success: true,
        message:
          "Gallery item deleted successfully.",
        data: deletedGallery,
      });
    } catch (error) {
      console.error(
        "DELETE GALLERY ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to delete gallery item.",
        error: error.message,
      });
    }
  }
);

// =====================================================
// MULTER ERROR HANDLER
// =====================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    if (
      error instanceof
      multer.MulterError
    ) {
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Image must be less than 5MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Image upload failed.",
      });
    }

    if (
      error?.message?.includes(
        "Only PNG"
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }

    next(error);
  }
);

// =====================================================
// 404 ROUTE
// =====================================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        `Route not found: ${req.method} ${req.originalUrl}`,
    });
  }
);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "GLOBAL SERVER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Internal server error.",
      error:
        error.message,
    });
  }
);

// =====================================================
// START SERVER
// =====================================================

app.listen(
  PORT,
  () => {
    console.log("");
    console.log(
      "========================================"
    );
    console.log(
      " ITEME OF HOPE FAMILY ORGANIZATION"
    );
    console.log(
      " Backend API Server"
    );
    console.log(
      "========================================"
    );

    console.log(
      ` Server:          http://localhost:${PORT}`
    );

    console.log(
      ` Health:          http://localhost:${PORT}/api/health`
    );

    console.log(
      ` Auth:            http://localhost:${PORT}/api/auth`
    );

    console.log(
      ` Children:        http://localhost:${PORT}/api/children`
    );

    console.log(
      ` Staff:           http://localhost:${PORT}/api/staff`
    );

    console.log(
      ` Members:         http://localhost:${PORT}/api/members`
    );

    console.log(
      ` Donations:       http://localhost:${PORT}/api/donations`
    );

    console.log(
      ` Reports:         http://localhost:${PORT}/api/reports`
    );

    console.log(
      ` Charity Weeks:   http://localhost:${PORT}/api/charity-weeks`
    );

    console.log(
      ` Messages:        http://localhost:${PORT}/api/messages`
    );

    console.log(
      ` Gallery:         http://localhost:${PORT}/api/gallery`
    );

    console.log(
      ` Gallery Images:  http://localhost:${PORT}/uploads/gallery`
    );

    console.log(
      "========================================"
    );

    console.log("");
  }
);

