import StudyLog from "../models/StudyLog.js";

export const logSession = async (req, res) => {
  try {
    const { date, hoursStudied, subject, topic } = req.body;

    if (!hoursStudied || !subject) {
      return res.status(400).json({
        success: false,
        message: "Hours studied and subject are required.",
      });
    }

    const log = await StudyLog.create({
      userId: req.user._id,
      date: date ? new Date(date) : new Date(),
      hoursStudied,
      subject,
      topic: topic || "",
    });

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to log study session.",
    });
  }
};

export const getWeeklySummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const logs = await StudyLog.find({
      userId: req.user._id,
      date: { $gte: startOfWeek, $lt: endOfWeek },
    });

    // Group by day
    const dailyBreakdown = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const key = d.toISOString().split("T")[0];
      dailyBreakdown[key] = 0;
    }

    let totalHours = 0;
    for (const log of logs) {
      const key = new Date(log.date).toISOString().split("T")[0];
      dailyBreakdown[key] = (dailyBreakdown[key] || 0) + log.hoursStudied;
      totalHours += log.hoursStudied;
    }

    // Group by subject
    const subjectBreakdown = {};
    for (const log of logs) {
      subjectBreakdown[log.subject] =
        (subjectBreakdown[log.subject] || 0) + log.hoursStudied;
    }

    res.json({
      success: true,
      data: {
        totalHours: Math.round(totalHours * 10) / 10,
        dailyBreakdown,
        subjectBreakdown,
        startDate: startOfWeek,
        endDate: endOfWeek,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get weekly summary.",
    });
  }
};

export const getMonthlySummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const logs = await StudyLog.find({
      userId: req.user._id,
      date: { $gte: startOfMonth, $lt: endOfMonth },
    }).sort("date");

    let totalHours = 0;
    const dailyBreakdown = {};

    for (const log of logs) {
      const key = new Date(log.date).toISOString().split("T")[0];
      dailyBreakdown[key] = (dailyBreakdown[key] || 0) + log.hoursStudied;
      totalHours += log.hoursStudied;
    }

    // Subject distribution
    const subjectBreakdown = {};
    for (const log of logs) {
      subjectBreakdown[log.subject] =
        (subjectBreakdown[log.subject] || 0) + log.hoursStudied;
    }

    res.json({
      success: true,
      data: {
        totalHours: Math.round(totalHours * 10) / 10,
        dailyBreakdown,
        subjectBreakdown,
        startDate: startOfMonth,
        endDate: endOfMonth,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get monthly summary.",
    });
  }
};
