import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
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
      enum: [
        "Charity",
        "Education",
        "Students",
        "Community",
        "Events",
        "Volunteers",
        "Training",
        "Other",
      ],
      default: "Other",
    },

    date: {
      type: Date,
      default: Date.now,
    },

    visible: {
      type: Boolean,
      default: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Gallery", gallerySchema);