import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
subjectSchema.index({ userId: 1, isDeleted: 1 });
subjectSchema.index({ userId: 1, createdAt: -1 });

// ── Soft-delete query middleware ──
// Automatically excludes soft-deleted docs for find queries
subjectSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export default mongoose.model("Subject", subjectSchema);
