import express from "express";
import Message from "../models/Message.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// =====================================================
// CREATE MESSAGE / REQUEST HELP
// PUBLIC
// =====================================================
// Used by the Members page "Request Help" form.
//
// Required:
// - name
// - email
// - subject
// - message

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message,
    } = req.body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject or help type is required.",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please explain how we can help you.",
      });
    }

    // -----------------------------------------------
    // BASIC EMAIL VALIDATION
    // -----------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // -----------------------------------------------
    // CREATE MESSAGE
    // -----------------------------------------------

    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      read: false,
      attachments: [],
    });

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "Your request has been sent successfully. ITEME of HOPE FAMILY ORGANIZATION will review it and get back to you.",
      data: newMessage,
    });
  } catch (error) {
    console.error(
      "CREATE MESSAGE ERROR:",
      error
    );

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const validationMessage = Object.values(
        error.errors
      )
        .map((err) => err.message)
        .join(", ");

      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to send your request.",
    });
  }
});

// =====================================================
// GET ALL MESSAGES
// ADMIN ONLY
// =====================================================

router.get("/", protect, async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error(
      "GET MESSAGES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load messages.",
    });
  }
});

// =====================================================
// GET SINGLE MESSAGE
// ADMIN ONLY
// =====================================================

router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const message =
        await Message.findById(req.params.id);

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: message,
      });
    } catch (error) {
      console.error(
        "GET SINGLE MESSAGE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to load message.",
      });
    }
  }
);

// =====================================================
// MARK MESSAGE AS READ / UNREAD
// ADMIN ONLY
// =====================================================

router.patch(
  "/:id/read",
  protect,
  async (req, res) => {
    try {
      const { read } = req.body;

      const message =
        await Message.findByIdAndUpdate(
          req.params.id,
          {
            read:
              read === true ||
              read === "true",
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: message.read
          ? "Message marked as read."
          : "Message marked as unread.",
        data: message,
      });
    } catch (error) {
      console.error(
        "UPDATE MESSAGE READ STATUS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update message status.",
      });
    }
  }
);

// =====================================================
// DELETE MESSAGE
// ADMIN ONLY
// =====================================================

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const message =
        await Message.findByIdAndDelete(
          req.params.id
        );

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Message deleted successfully.",
      });
    } catch (error) {
      console.error(
        "DELETE MESSAGE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete message.",
      });
    }
  }
);

export default router;

