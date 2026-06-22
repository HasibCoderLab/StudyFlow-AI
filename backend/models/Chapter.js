import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Chapter name is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["not-started", "learning", "completed"],
      default: "not-started",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chapter", chapterSchema);
