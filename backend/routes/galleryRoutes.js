import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

import Gallery from "../models/Gallery.js";

const router = express.Router();

// =====================================================
// CLOUDINARY CONFIGURATION
// =====================================================
//
// Your backend .env should contain:
//
// CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
//
// Example:
// CLOUDINARY_URL=cloudinary://123456789:abcdefg@akzmodej
//
// IMPORTANT:
// Do NOT put <your_api_key>, YOUR_REAL_API_KEY,
// or placeholder values in the actual .env file.
// =====================================================

const cloudinaryUrl = process.env.CLOUDINARY_URL;

if (!cloudinaryUrl) {
  console.error(
    "❌ CLOUDINARY_URL is missing from backend .env"
  );
} else {
  console.log("✅ CLOUDINARY_URL found.");
}

// Configure Cloudinary directly using CLOUDINARY_URL
if (cloudinaryUrl) {
  cloudinary.config({
    cloudinary_url: cloudinaryUrl,
  });
}

// =====================================================
// CLOUDINARY CONFIGURATION CHECK
// =====================================================

function isCloudinaryConfigured() {
  return Boolean(process.env.CLOUDINARY_URL);
}

// =====================================================
// MULTER
// =====================================================
//
// Images are stored temporarily in memory.
//
// Browser
//    ↓
// Multer memoryStorage
//    ↓
// Cloudinary
//    ↓
// MongoDB stores Cloudinary URL
//
// Nothing is saved to uploads/gallery locally.
// =====================================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
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

// =====================================================
// CLOUDINARY UPLOAD HELPER
// =====================================================

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(
        new Error(
          "CLOUDINARY_URL is missing from backend .env."
        )
      );
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "iteme-of-hope/gallery",
        resource_type: "image",

        transformation: [
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },

      (error, result) => {
        if (error) {
          console.error(
            "Cloudinary upload error:",
            error
          );

          return reject(error);
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

// =====================================================
// GET CLOUDINARY PUBLIC ID
// =====================================================

function getCloudinaryPublicId(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  try {
    if (!imageUrl.includes("res.cloudinary.com")) {
      return null;
    }

    const uploadMarker = "/upload/";

    const uploadIndex =
      imageUrl.indexOf(uploadMarker);

    if (uploadIndex === -1) {
      return null;
    }

    let publicId = imageUrl.substring(
      uploadIndex + uploadMarker.length
    );

    // Remove transformations if present.
    //
    // Example:
    // q_auto,f_auto/v123/iteme-of-hope/gallery/photo.jpg

    const parts = publicId.split("/");

    while (
      parts.length > 0 &&
      (
        parts[0].startsWith("q_") ||
        parts[0].startsWith("f_") ||
        parts[0].startsWith("w_") ||
        parts[0].startsWith("h_") ||
        parts[0].startsWith("c_") ||
        parts[0].startsWith("ar_")
      )
    ) {
      parts.shift();
    }

    publicId = parts.join("/");

    // Remove Cloudinary version
    publicId = publicId.replace(
      /^v\d+\//,
      ""
    );

    // Remove extension
    publicId = publicId.replace(
      /\.[^/.]+$/,
      ""
    );

    return publicId;
  } catch (error) {
    console.error(
      "Error extracting Cloudinary public ID:",
      error.message
    );

    return null;
  }
}

// =====================================================
// DELETE IMAGE FROM CLOUDINARY
// =====================================================

async function deleteFromCloudinary(imageUrl) {
  if (!imageUrl) {
    return;
  }

  const publicId =
    getCloudinaryPublicId(imageUrl);

  if (!publicId) {
    console.log(
      "No Cloudinary public ID found. Skipping image deletion."
    );

    return;
  }

  if (!isCloudinaryConfigured()) {
    console.warn(
      "CLOUDINARY_URL is missing. Skipping Cloudinary deletion."
    );

    return;
  }

  try {
    const result =
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: "image",
        }
      );

    console.log(
      "Cloudinary delete result:",
      result
    );
  } catch (error) {
    console.error(
      "CLOUDINARY DELETE ERROR:",
      error.message
    );

    // Do not prevent MongoDB deletion
    // if Cloudinary deletion fails.
  }
}

// =====================================================
// VALIDATE MONGODB OBJECT ID
// =====================================================

function validateObjectId(req, res, next) {
  if (
    !mongoose.Types.ObjectId.isValid(
      req.params.id
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid gallery ID.",
    });
  }

  next();
}

// =====================================================
// GET ALL GALLERY
// GET /api/gallery
// =====================================================

router.get("/", async (req, res) => {
  try {
    const gallery = await Gallery.find()
      .sort({
        date: -1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json(gallery);
  } catch (error) {
    console.error(
      "GET GALLERY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load gallery.",
      error: error.message,
    });
  }
});

// =====================================================
// GET VISIBLE GALLERY
// GET /api/gallery/visible
// =====================================================

router.get("/visible", async (req, res) => {
  try {
    const gallery = await Gallery.find({
      visible: true,
    })
      .sort({
        date: -1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json(gallery);
  } catch (error) {
    console.error(
      "GET VISIBLE GALLERY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load visible gallery.",
      error: error.message,
    });
  }
});

// =====================================================
// GET ONE GALLERY ITEM
// GET /api/gallery/:id
// =====================================================

router.get(
  "/:id",
  validateObjectId,
  async (req, res) => {
    try {
      const gallery =
        await Gallery.findById(
          req.params.id
        ).lean();

      if (!gallery) {
        return res.status(404).json({
          success: false,
          message:
            "Gallery item not found.",
        });
      }

      return res.status(200).json(gallery);
    } catch (error) {
      console.error(
        "GET GALLERY ITEM ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load gallery item.",
        error: error.message,
      });
    }
  }
);

// =====================================================
// CREATE GALLERY ITEM
// POST /api/gallery
// =====================================================
//
// FormData:
//
// title
// description
// category
// date
// visible
// image
// =====================================================

router.post(
  "/",
  upload.single("image"),
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
          ? req.file.originalname
          : "NO FILE"
      );

      console.log(
        "CLOUDINARY:",
        isCloudinaryConfigured()
          ? "CONFIGURED"
          : "NOT CONFIGURED"
      );

      console.log(
        "===================================="
      );

      // -------------------------------------------------
      // CHECK CLOUDINARY
      // -------------------------------------------------

      if (!isCloudinaryConfigured()) {
        return res.status(500).json({
          success: false,
          message:
            "Cloudinary is not configured. Add CLOUDINARY_URL to backend .env and restart the server.",
        });
      }

      // -------------------------------------------------
      // CHECK IMAGE
      // -------------------------------------------------

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Gallery image is required.",
        });
      }

      // -------------------------------------------------
      // CHECK TITLE
      // -------------------------------------------------

      const title =
        req.body.title?.trim();

      if (!title) {
        return res.status(400).json({
          success: false,
          message:
            "Gallery title is required.",
        });
      }

      // -------------------------------------------------
      // CATEGORY
      // -------------------------------------------------

      const allowedCategories = [
        "Charity",
        "Education",
        "Students",
        "Community",
        "Events",
        "Volunteers",
        "Training",
        "Other",
      ];

      const category =
        allowedCategories.includes(
          req.body.category
        )
          ? req.body.category
          : "Other";

      // -------------------------------------------------
      // DATE
      // -------------------------------------------------

      let galleryDate = new Date();

      if (
        req.body.date &&
        req.body.date.trim() !== ""
      ) {
        const parsedDate =
          new Date(req.body.date);

        if (
          Number.isNaN(
            parsedDate.getTime()
          )
        ) {
          return res.status(400).json({
            success: false,
            message: "Invalid gallery date.",
          });
        }

        galleryDate = parsedDate;
      }

      // -------------------------------------------------
      // VISIBILITY
      // -------------------------------------------------

      const visible =
        req.body.visible === undefined
          ? true
          : req.body.visible === "true" ||
            req.body.visible === true;

      // -------------------------------------------------
      // UPLOAD TO CLOUDINARY
      // -------------------------------------------------

      console.log(
        "Uploading image to Cloudinary..."
      );

      const uploadedImage =
        await uploadToCloudinary(
          req.file.buffer
        );

      if (
        !uploadedImage ||
        !uploadedImage.secure_url
      ) {
        throw new Error(
          "Cloudinary did not return an image URL."
        );
      }

      console.log(
        "Cloudinary upload successful."
      );

      console.log(
        "Image URL:",
        uploadedImage.secure_url
      );

      // -------------------------------------------------
      // SAVE TO MONGODB
      // -------------------------------------------------

      const gallery =
        await Gallery.create({
          title,

          description:
            req.body.description?.trim() ||
            "",

          image:
            uploadedImage.secure_url,

          category,

          date: galleryDate,

          visible,

          uploadedBy:
            req.user?._id ||
            req.user?.id ||
            null,
        });

      console.log(
        "Gallery saved to MongoDB:",
        gallery._id
      );

      console.log(
        "===================================="
      );

      return res.status(201).json(
        gallery
      );
    } catch (error) {
      console.error("");
      console.error(
        "CREATE GALLERY ERROR:",
        error
      );
      console.error("");

      return res.status(
        error.http_code || 500
      ).json({
        success: false,
        message:
          error.message ||
          "Failed to create gallery item.",
      });
    }
  }
);

// =====================================================
// UPDATE GALLERY ITEM
// PUT /api/gallery/:id
// =====================================================

router.put(
  "/:id",
  validateObjectId,
  upload.single("image"),
  async (req, res) => {
    try {
      const gallery =
        await Gallery.findById(
          req.params.id
        );

      if (!gallery) {
        return res.status(404).json({
          success: false,
          message:
            "Gallery item not found.",
        });
      }

      // -------------------------------------------------
      // TITLE
      // -------------------------------------------------

      if (
        req.body.title !== undefined
      ) {
        const title =
          req.body.title.trim();

        if (!title) {
          return res.status(400).json({
            success: false,
            message:
              "Gallery title cannot be empty.",
          });
        }

        gallery.title = title;
      }

      // -------------------------------------------------
      // DESCRIPTION
      // -------------------------------------------------

      if (
        req.body.description !==
        undefined
      ) {
        gallery.description =
          req.body.description.trim();
      }

      // -------------------------------------------------
      // CATEGORY
      // -------------------------------------------------

      if (
        req.body.category !==
        undefined
      ) {
        const allowedCategories = [
          "Charity",
          "Education",
          "Students",
          "Community",
          "Events",
          "Volunteers",
          "Training",
          "Other",
        ];

        if (
          allowedCategories.includes(
            req.body.category
          )
        ) {
          gallery.category =
            req.body.category;
        }
      }

      // -------------------------------------------------
      // DATE
      // -------------------------------------------------

      if (
        req.body.date !== undefined &&
        req.body.date !== ""
      ) {
        const newDate =
          new Date(req.body.date);

        if (
          Number.isNaN(
            newDate.getTime()
          )
        ) {
          return res.status(400).json({
            success: false,
            message: "Invalid date.",
          });
        }

        gallery.date = newDate;
      }

      // -------------------------------------------------
      // VISIBILITY
      // -------------------------------------------------

      if (
        req.body.visible !==
        undefined
      ) {
        gallery.visible =
          req.body.visible ===
            "true" ||
          req.body.visible === true;
      }

      // -------------------------------------------------
      // REPLACE IMAGE
      // -------------------------------------------------

      if (req.file) {
        if (!isCloudinaryConfigured()) {
          return res.status(500).json({
            success: false,
            message:
              "Cloudinary is not configured.",
          });
        }

        const oldImage =
          gallery.image;

        console.log(
          "Uploading replacement image..."
        );

        const uploadedImage =
          await uploadToCloudinary(
            req.file.buffer
          );

        if (
          !uploadedImage ||
          !uploadedImage.secure_url
        ) {
          throw new Error(
            "Cloudinary did not return a new image URL."
          );
        }

        gallery.image =
          uploadedImage.secure_url;

        // Delete old image after
        // successful new upload
        if (oldImage) {
          await deleteFromCloudinary(
            oldImage
          );
        }

        console.log(
          "Replacement image uploaded successfully."
        );
      }

      // -------------------------------------------------
      // SAVE
      // -------------------------------------------------

      await gallery.save();

      console.log(
        "Gallery updated:",
        gallery._id
      );

      return res.status(200).json(
        gallery
      );
    } catch (error) {
      console.error(
        "UPDATE GALLERY ERROR:",
        error
      );

      return res.status(
        error.http_code || 500
      ).json({
        success: false,
        message:
          error.message ||
          "Failed to update gallery item.",
      });
    }
  }
);

// =====================================================
// TOGGLE VISIBILITY
// PATCH /api/gallery/:id/visibility
// =====================================================

router.patch(
  "/:id/visibility",
  validateObjectId,
  async (req, res) => {
    try {
      const gallery =
        await Gallery.findById(
          req.params.id
        );

      if (!gallery) {
        return res.status(404).json({
          success: false,
          message:
            "Gallery item not found.",
        });
      }

      gallery.visible =
        !gallery.visible;

      await gallery.save();

      return res.status(200).json({
        success: true,

        message: gallery.visible
          ? "Gallery item is now visible."
          : "Gallery item is now hidden.",

        gallery,
      });
    } catch (error) {
      console.error(
        "TOGGLE VISIBILITY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to change gallery visibility.",
        error: error.message,
      });
    }
  }
);

// =====================================================
// DELETE GALLERY ITEM
// DELETE /api/gallery/:id
// =====================================================

router.delete(
  "/:id",
  validateObjectId,
  async (req, res) => {
    try {
      const gallery =
        await Gallery.findById(
          req.params.id
        );

      if (!gallery) {
        return res.status(404).json({
          success: false,
          message:
            "Gallery item not found.",
        });
      }

      // -------------------------------------------------
      // DELETE CLOUDINARY IMAGE
      // -------------------------------------------------

      if (gallery.image) {
        await deleteFromCloudinary(
          gallery.image
        );
      }

      // -------------------------------------------------
      // DELETE MONGODB RECORD
      // -------------------------------------------------

      await Gallery.findByIdAndDelete(
        req.params.id
      );

      console.log(
        "Gallery deleted:",
        req.params.id
      );

      return res.status(200).json({
        success: true,

        message:
          "Gallery item deleted successfully.",

        id: req.params.id,
      });
    } catch (error) {
      console.error(
        "DELETE GALLERY ERROR:",
        error
      );

      return res.status(
        error.http_code || 500
      ).json({
        success: false,
        message:
          error.message ||
          "Failed to delete gallery item.",
      });
    }
  }
);

// =====================================================
// MULTER ERROR HANDLER
// =====================================================

router.use(
  (error, req, res, next) => {
    console.error(
      "GALLERY UPLOAD ERROR:",
      error
    );

    if (
      error instanceof multer.MulterError
    ) {
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Image is too large. Maximum size is 5MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Image upload failed.",
      });
    }

    if (error) {
      return res.status(
        error.http_code || 400
      ).json({
        success: false,
        message:
          error.message ||
          "Image upload failed.",
      });
    }

    next();
  }
);

// =====================================================
// EXPORT
// =====================================================

export default router;

