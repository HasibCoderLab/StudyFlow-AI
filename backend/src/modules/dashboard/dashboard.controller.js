import StudyLog from "../../models/StudyLog.js";
import QuizAttempt from "../../models/QuizAttempt.js";
import Subject from "../../models/Subject.js";
import catchAsync from "../../utils/catchAsync.js";

export const getDashboardStats = catchAsync(async (req, res) => {
  const userId = req.user._id;

  // ── Current week hours ──
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weekLogs = await StudyLog.find({
    userId,
    date: { $gte: startOfWeek },
  });
  const hoursThisWeek = weekLogs.reduce(
    (sum, log) => sum + log.hoursStudied,
    0
  );

  // ── Study streak (consecutive days from most recent log) ──
  const allLogs = await StudyLog.find({ userId }).sort("-date");
  let streak = 0;

  if (allLogs.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstLog = new Date(allLogs[0].date);
    firstLog.setHours(0, 0, 0, 0);
    const gap = Math.round((today - firstLog) / (1000 * 60 * 60 * 24));

    if (gap <= 1) {
      streak = 1;
      for (let i = 1; i < allLogs.length; i++) {
        const logDate = new Date(allLogs[i].date);
        logDate.setHours(0, 0, 0, 0);
        const expectedDate = new Date(firstLog);
        expectedDate.setDate(firstLog.getDate() - streak);
        if (logDate.getTime() === expectedDate.getTime()) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  // ── Quiz stats ──
  const recentAttempts = await QuizAttempt.find({ userId }).sort("-attemptedAt");
  const totalQuizzes = recentAttempts.length;
  let totalPercentage = 0;
  for (const a of recentAttempts) {
    totalPercentage +=
      a.totalQuestions > 0 ? (a.score / a.totalQuestions) * 100 : 0;
  }
  const avgQuizScore =
    totalQuizzes > 0 ? Math.round(totalPercentage / totalQuizzes) : 0;

  // ── Points (simulated: 10 per quiz completed, 5 per study hour) ──
  const totalPoints = totalQuizzes * 10 + Math.round(hoursThisWeek * 5);

  // ── Subject count ──
  const subjectCount = await Subject.countDocuments({ userId });

  res.json({
    success: true,
    data: {
      streak,
      points: totalPoints.toLocaleString(),
      avgQuizScore,
      hoursThisWeek: Math.round(hoursThisWeek * 10) / 10,
      totalQuizzes,
      subjectCount,
    },
  });
});
