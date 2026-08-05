import mongoose from "mongoose";

const charityWeekSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    theme: String,
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    goalAmount: {
      type: Number,
      default: 0,
    },
    raisedAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "closed"],
      default: "upcoming",
    },
    description: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CharityWeek", charityWeekSchema);