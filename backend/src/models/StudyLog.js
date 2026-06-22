import mongoose from "mongoose";

const studyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    hoursStudied: {
      type: Number,
      required: [true, "Hours studied is required"],
      min: 0,
    },
    subject: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ── Compound Indexes ──
studyLogSchema.index({ userId: 1, date: -1 });
studyLogSchema.index({ userId: 1, subject: 1 });

export default mongoose.model("StudyLog", studyLogSchema);
