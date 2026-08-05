import mongoose from "mongoose";

const childSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    age: Number,
    grade: String,
    district: String,
    story: String,
    feeNeeded: {
      type: Number,
      default: 0,
    },
    amountRaised: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["urgent", "sponsored"],
      default: "urgent",
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Child", childSchema);