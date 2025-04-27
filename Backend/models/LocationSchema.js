import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      default: "Kerala",
    },
    city: {
      type: String,
      required: true,
    },
    isActive: {
      type: String,
      enum: ["true", "false"],
      default: "true",
    },
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", locationSchema);

export default Location

