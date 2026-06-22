import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    duration: { type: String, default: "30 min" },
    completed: { type: Boolean, default: false },
  },
  { _id: true }
);

const daySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    tasks: [taskSchema],
  },
  { _id: false }
);

const studyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    examDate: {
      type: Date,
      required: true,
    },
    dailyHours: {
      type: Number,
      default: 4,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    days: [daySchema],
  },
  { timestamps: true }
);

export default mongoose.model("StudyPlan", studyPlanSchema);
