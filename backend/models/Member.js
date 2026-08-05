import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    // =====================================================
    // FULL NAME
    // =====================================================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // MEMBERSHIP TYPE
    // =====================================================
    membershipType: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Volunteer",
        "Community Partner",
        "Donor Member",
        "Board Member",
      ],
    },

    // =====================================================
    // JOINED DATE
    // =====================================================
    joinedDate: {
      type: Date,
      default: Date.now,
    },

    // =====================================================
    // CONTACT
    // Can contain phone number or email
    // =====================================================
    contact: {
      type: String,
      trim: true,
      default: "",
    },

    // =====================================================
    // REASON FOR JOINING
    // =====================================================
    reason: {
      type: String,
      trim: true,
      default: "",
    },

    // =====================================================
    // MEMBER PHOTO
    // =====================================================
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Member", memberSchema);

