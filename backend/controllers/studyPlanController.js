import StudyPlan from "../models/StudyPlan.js";
import { askGemini } from "../utils/geminiClient.js";
import { stripMarkdownFences } from "../utils/helpers.js";

/* ─── Dummy topic banks for fallback ─── */
const topicsBySubject = {
  physics: [
    "Scalars & Vectors",
    "Newton's Laws of Motion",
    "Work, Energy & Power",
    "Gravitation",
    "Thermal Physics",
    "Wave Motion & Sound",
    "Optics — Reflection & Refraction",
    "Electrostatics",
    "Current Electricity",
    "Magnetic Effects of Current",
    "Modern Physics — Radioactivity",
  ],
  chemistry: [
    "Atomic Structure",
    "Chemical Bonding",
    "Periodic Table Trends",
    "Stoichiometry & Mole Concept",
    "Chemical Reactions & Equations",
    "Acids, Bases & Salts",
    "Thermochemistry",
    "Electrochemistry",
    "Organic Chemistry — Hydrocarbons",
    "Organic Chemistry — Functional Groups",
  ],
  biology: [
    "Cell Structure & Function",
    "Cell Division — Mitosis & Meiosis",
    "Plant Physiology — Photosynthesis",
    "Plant Physiology — Respiration",
    "Human Digestive System",
    "Human Circulatory System",
    "Human Respiratory System",
    "Human Nervous System",
    "Genetics & Heredity",
    "Biotechnology & Genetic Engineering",
    "Ecology & Environment",
  ],
  math: [
    "Algebra — Quadratic Equations",
    "Algebra — Sequences & Series",
    "Trigonometry — Ratios & Identities",
    "Trigonometry — Equations",
    "Coordinate Geometry — Straight Lines",
    "Coordinate Geometry — Circles",
    "Calculus — Limits & Continuity",
    "Calculus — Derivatives",
    "Calculus — Integration Basics",
    "Statistics & Probability",
    "Vectors & 3D Geometry",
  ],
};

export function generateDummyPlan({ examDate, subjects, dailyHours }) {
  const startDate = new Date();
  const endDate = new Date(examDate);
  const totalDays = Math.max(
    1,
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  );

  const days = [];
  let topicIndex = 0;

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const tasksPerDay = Math.max(
      1,
      Math.min(3, Math.round(dailyHours / 1.5))
    );
    const dayTasks = [];

    for (let j = 0; j < tasksPerDay; j++) {
      const subjectIdx = (j + i) % subjects.length;
      const subject = subjects[subjectIdx].toLowerCase();
      const topics = topicsBySubject[subject] || ["General Topic"];
      const topic = topics[topicIndex % topics.length];
      topicIndex++;

      dayTasks.push({
        subject: subjects[subjectIdx],
        topic,
        duration: `${Math.round(30 + Math.random() * 30)} min`,
        completed: currentDate < new Date(new Date().toDateString()),
      });
    }

    days.push({
      date: currentDate,
      tasks: dayTasks,
    });
  }

  return { days, totalDays, examDate, dailyHours };
}



export const getCurrentPlan = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({
      userId: req.user._id,
    }).sort("-generatedAt");

    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch study plan.",
    });
  }
};

export const generatePlan = async (req, res) => {
  try {
    const { examDate, subjects, dailyHours, classLevel, goal } = req.body;

    if (!examDate || !subjects || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Exam date and at least one subject are required.",
      });
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
        planDays = parsed.map((day, di) => ({
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
      console.warn("Gemini plan generation failed, falling back to dummy logic:", geminiErr.message);
    }

    // Fallback to dummy logic if Gemini failed or returned invalid data
    if (!planDays) {
      const dummy = generateDummyPlan({ examDate, subjects, dailyHours: dailyHours || 4 });
      planDays = dummy.days;
    }

    const plan = await StudyPlan.create({
      userId: req.user._id,
      examDate: new Date(examDate),
      dailyHours: dailyHours || 4,
      days: planDays,
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate plan.",
    });
  }
};

export const toggleTaskCompletion = async (req, res) => {
  try {
    const { planId, dayIndex, taskId } = req.params;

    const plan = await StudyPlan.findOne({
      _id: planId,
      userId: req.user._id,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Study plan not found.",
      });
    }

    const day = plan.days[dayIndex];
    if (!day) {
      return res.status(404).json({
        success: false,
        message: "Day not found.",
      });
    }

    const task = day.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    task.completed = !task.completed;
    await plan.save();

    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle task.",
    });
  }
};
