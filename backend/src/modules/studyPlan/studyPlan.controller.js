import StudyPlan from "../../models/StudyPlan.js";
import { askGemini } from "../../utils/geminiClient.js";
import { stripMarkdownFences } from "../../utils/helpers.js";
import { generateDummyPlan } from "./studyPlan.service.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiError from "../../utils/ApiError.js";

export const getCurrentPlan = catchAsync(async (req, res) => {
  const plan = await StudyPlan.findOne({ userId: req.user._id }).sort(
    "-generatedAt"
  );
  res.json({ success: true, data: plan });
});

export const generatePlan = catchAsync(async (req, res) => {
  const { examDate, subjects, dailyHours, classLevel, goal } = req.body;

  if (!examDate || !subjects || subjects.length === 0) {
    throw new ApiError(400, "Exam date and at least one subject are required.");
  }

  const startDate = new Date();
  const endDate = new Date(examDate);
  const totalDays = Math.max(
    1,
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  );

  const userPrompt = JSON.stringify({
    examDate,
    subjects,
    dailyHours: dailyHours || 4,
    classLevel: classLevel || "student",
    goal: goal || "exam preparation",
    totalDays,
    startDate: startDate.toISOString().split("T")[0],
  });

  const systemPrompt =
    "You are an expert study coach. Output ONLY valid JSON, no markdown, no explanation: " +
    '[{"date":"YYYY-MM-DD","tasks":[{"subject":"SubjectName","topic":"Specific Topic","duration":"45 min"}]}] ' +
    "Each day should have 1-3 tasks. Cover all subjects evenly across the available days. " +
    "Make topics specific, realistic, and grade-appropriate.";

  let planDays = null;

  try {
    const geminiText = await askGemini(systemPrompt, userPrompt, 4096);
    const cleaned = stripMarkdownFences(geminiText);
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) {
      planDays = parsed.map((day) => ({
        date: new Date(day.date),
        tasks: (day.tasks || []).map((t) => ({
          subject: t.subject || subjects[0],
          topic: t.topic || "General Topic",
          duration: t.duration || "30 min",
          completed: new Date(day.date) < new Date(new Date().toDateString()),
        })),
      }));
    }
  } catch (geminiErr) {
    console.warn(
      "Gemini plan generation failed, falling back to dummy logic:",
      geminiErr.message
    );
  }

  // Fallback to dummy logic if Gemini failed or returned invalid data
  if (!planDays) {
    const dummy = generateDummyPlan({
      examDate,
      subjects,
      dailyHours: dailyHours || 4,
    });
    planDays = dummy.days;
  }

  const plan = await StudyPlan.create({
    userId: req.user._id,
    examDate: new Date(examDate),
    dailyHours: dailyHours || 4,
    days: planDays,
  });

  res.status(201).json({ success: true, data: plan });
});

export const toggleTaskCompletion = catchAsync(async (req, res) => {
  const { planId, dayIndex, taskId } = req.params;

  const plan = await StudyPlan.findOne({ _id: planId, userId: req.user._id });
  if (!plan) throw new ApiError(404, "Study plan not found.");

  const day = plan.days[dayIndex];
  if (!day) throw new ApiError(404, "Day not found.");

  const task = day.tasks.id(taskId);
  if (!task) throw new ApiError(404, "Task not found.");

  task.completed = !task.completed;
  await plan.save();

  res.json({ success: true, data: plan });
});
