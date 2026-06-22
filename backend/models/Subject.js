import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    totalChapters: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: "indigo",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
