import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
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
    // ── Soft Delete ──
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true }
);

// ── Indexes ──
chapterSchema.index({ subjectId: 1, isDeleted: 1 });
chapterSchema.index({ subjectId: 1, order: 1 });

// ── Soft-delete query middleware ──
chapterSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export default mongoose.model("Chapter", chapterSchema);
