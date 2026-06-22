import { useState, useEffect } from "react";
import {
  Brain,
  TrendingUp,
  Clock,
  Zap,
  Trophy,
  BookOpen,
  Flame,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { getDashboardStats } from "../api/dashboard";
import { getWeeklySummary, getMonthlySummary } from "../api/studyLogs";
import { getQuizHistory } from "../api/quiz";
import { getSubjects } from "../api/subjects";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getActivityIcon(type) {
  if (type === "quiz") {
    return { icon: Brain, color: "text-indigo-400", bg: "bg-indigo-500/10" };
  }
  return { icon: BookOpen, color: "text-green-400", bg: "bg-green-500/10" };
}

const subjectColors = ["#818cf8", "#34d399", "#fb923c", "#f472b6", "#a78bfa", "#22d3ee", "#fbbf24"];

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [weeklyLog, setWeeklyLog] = useState(null);
  const [monthlyLog, setMonthlyLog] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        const [statsRes, histRes, weeklyRes, monthlyRes, subjectsRes] = await Promise.allSettled([
          getDashboardStats(),
          getQuizHistory(50),
          getWeeklySummary(),
          getMonthlySummary(),
          getSubjects(),
        ]);
        if (cancelled) return;
        if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
        if (histRes.status === "fulfilled") setHistory(histRes.value.data || []);
        if (weeklyRes.status === "fulfilled") setWeeklyLog(weeklyRes.value.data);
        if (monthlyRes.status === "fulfilled") setMonthlyLog(monthlyRes.value.data);
        if (subjectsRes.status === "fulfilled") setSubjects(subjectsRes.value.data || []);
      } catch (_) {}
      if (!cancelled) setLoading(false);
    }
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  // Build overview stats from real data
  const overviewStats = [
    {
      icon: Trophy, label: "Quizzes Taken", value: stats?.totalQuizzes || 0, unit: "",
      color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/15",
    },
    {
      icon: Target, label: "Avg Score", value: stats?.avgQuizScore || 0, unit: "%",
      color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/15",
    },
    {
      icon: Flame, label: "Study Streak", value: stats?.streak || 0, unit: "days",
      color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/15",
    },
    {
      icon: Clock, label: "Total Study Hours", value: stats?.hoursThisWeek || "0", unit: "h",
      color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/15",
    },
  ];

  // Build weekly trend from quiz history (group by week)
  const weeklyTrend = (() => {
    if (history.length === 0) {
      return Array.from({ length: 8 }, (_, i) => ({ week: `W${i + 1}`, score: 0 }));
    }
    const sorted = [...history].sort((a, b) => new Date(a.attemptedAt) - new Date(b.attemptedAt));
    const weekMap = {};
    sorted.forEach((h, i) => {
      const weekNum = Math.floor(i / 5) + 1;
      if (!weekMap[weekNum]) weekMap[weekNum] = [];
      const pct = h.totalQuestions > 0 ? Math.round((h.score / h.totalQuestions) * 100) : 0;
      weekMap[weekNum].push(pct);
    });
    return Object.entries(weekMap).map(([week, scores]) => ({
      week: `W${week}`,
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    })).slice(0, 8);
  })();

  // Build subject performance from subjects list
  const subjectPerformance = subjects.length > 0
    ? subjects.map((s, i) => ({
        name: s.name,
        score: Math.min((s.totalChapters || 0) * 15, 95) || 20,
        color: subjectColors[i % subjectColors.length],
        change: `${s.totalChapters || 0} chapters`,
      }))
    : [];

  // Build study time distribution from monthly logs
  const studyTimeData = monthlyLog?.subjectBreakdown
    ? Object.entries(monthlyLog.subjectBreakdown).map(([name, hours], i) => ({
        name,
        hours: Math.round(hours * 10) / 10,
        color: subjectColors[i % subjectColors.length],
      }))
    : [];

  // Build streak calendar from weekly logs (generate 28-day grid)
  const streakData = (() => {
    const grid = [];
    const now = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const active = weeklyLog?.dailyBreakdown?.[key] > 0 || monthlyLog?.dailyBreakdown?.[key] > 0;
      grid.push({
        day: weekDays[d.getDay()],
        week: Math.floor((27 - i) / 7),
        active,
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      });
    }
    return grid;
  })();

  // Build recent activity from quiz history + study logs
  const recentActivity = (() => {
    const items = [];
    history.slice(0, 5).forEach((h) => {
      const pct = h.totalQuestions > 0 ? Math.round((h.score / h.totalQuestions) * 100) : 0;
      const timeAgo = getTimeAgo(h.attemptedAt);
      items.push({
        id: h._id, type: "quiz",
        label: `Completed ${h.subject} Quiz`,
        detail: `${h.score}/${h.totalQuestions} — ${pct}%`,
        time: timeAgo,
        status: pct >= 80 ? "success" : pct >= 60 ? "warning" : "info",
      });
    });
    if (items.length === 0) {
      items.push({ id: "empty", type: "info", label: "No activity yet", detail: "Start studying to see your activity here", time: "", status: "info" });
    }
    return items;
  })();

  function getTimeAgo(dateStr) {
    if (!dateStr) return "";
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <Sidebar />
        <div className="lg:ml-64 flex flex-col min-h-screen">
          <Topbar />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl bg-dark-800/50 border border-dark-700 p-5 animate-pulse">
                    <div className="h-4 w-1/3 bg-dark-600 rounded mb-3" />
                    <div className="h-3 w-2/3 bg-dark-600 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-dark-600 rounded" />
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-2xl bg-dark-800/50 border border-dark-700 p-5 animate-pulse">
                    <div className="h-4 w-1/2 bg-dark-600 rounded mb-3" />
                    <div className="h-3 w-full bg-dark-600 rounded mb-2" />
                    <div className="h-3 w-3/4 bg-dark-600 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Sidebar />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Topbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Analytics</h1>
              <p className="text-sm text-gray-400 mt-1">
                Track your performance, progress, and study habits
              </p>
            </div>
            <div className="flex items-center gap-2 bg-dark-800/80 border border-dark-700 rounded-xl p-1">
              <span className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg">Overview</span>
              <span className="px-3 py-1.5 text-xs font-medium text-gray-400">Monthly</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column — main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {overviewStats.map((stat, i) => (
                  <div
                    key={i}
                    className={`${stat.bg} ${stat.border} border rounded-xl p-4 hover:scale-[1.02] transition-transform duration-200`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`${stat.color} ${stat.bg} p-1.5 rounded-lg`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        {stat.label}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                      <span className="text-sm font-normal text-gray-400 ml-1">
                        {stat.unit}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Quiz Score Trend */}
              <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Quiz Score Trend
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500">
                    {weeklyTrend.length > 0 && weeklyTrend.filter(w => w.score > 0).length > 0
                      ? `Avg: ${Math.round(weeklyTrend.filter(w => w.score > 0).reduce((a, b) => a + b.score, 0) / weeklyTrend.filter(w => w.score > 0).length)}%`
                      : "No data yet"}
                  </span>
                </div>
                <div className="h-52 sm:h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <XAxis
                        dataKey="week"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        domain={[0, 100]}
                        ticks={[0, 25, 50, 75, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "10px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                          color: "#e2e8f0",
                          fontSize: "13px",
                        }}
                        formatter={(value) => [`${value}%`, "Score"]}
                      />
                      <defs>
                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                      </defs>
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="url(#scoreGrad)"
                        strokeWidth={2.5}
                        dot={{ fill: "#818cf8", strokeWidth: 0, r: 4 }}
                        activeDot={{ fill: "#818cf8", stroke: "#1e293b", strokeWidth: 3, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Subject Performance */}
              <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
                <div className="flex items-center gap-2 mb-5">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                    Subject Performance
                  </h3>
                </div>
                <div className="space-y-5">
                  {subjectPerformance.length > 0 ? subjectPerformance.map((subj, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-300">
                            {subj.name}
                          </span>
                          <span className="text-xs text-gray-500">{subj.change}</span>
                        </div>
                        <span
                          className="text-sm font-bold"
                          style={{ color: subj.color }}
                        >
                          {subj.score}%
                        </span>
                      </div>
                      <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${subj.score}%`,
                            backgroundColor: subj.color,
                          }}
                        />
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500 text-center py-4">Add subjects to see performance</p>
                  )}
                </div>
              </div>

              {/* Streak Calendar */}
              <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                    Study Streak — Last 4 Weeks
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-7 gap-1.5 min-w-[280px]">
                    {/* Day headers */}
                    {weekDays.map((d) => (
                      <div
                        key={d}
                        className="text-center text-[10px] font-medium text-gray-500 pb-2"
                      >
                        {d}
                      </div>
                    ))}
                    {/* Streak cells */}
                    {streakData.map((cell, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-md flex items-center justify-center text-[9px] font-semibold transition-all duration-200 ${
                          cell.active
                            ? "bg-indigo-500/70 text-white shadow-sm shadow-indigo-500/20"
                            : "bg-dark-800 border border-dark-700 text-gray-600"
                        }`}
                        title={cell.date}
                      >
                        {cell.active ? "✓" : ""}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  <span className="text-indigo-400 font-semibold">{stats?.streak || 0}-day streak</span> — keep it going!
                </p>
              </div>
            </div>

            {/* Right column — sidebar content */}
            <div className="space-y-6">
              {/* Study Time Distribution */}
              <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
                <div className="flex items-center gap-2 mb-4">
                  <PieChartIcon className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                    Study Time Distribution
                  </h3>
                </div>
                <div className="h-48">
                  {studyTimeData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={studyTimeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="hours"
                          stroke="none"
                        >
                          {studyTimeData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "10px",
                            fontSize: "13px",
                            color: "#e2e8f0",
                          }}
                          formatter={(value, name) => [`${value}h`, name]}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-gray-500">Log study sessions to see distribution</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2 mt-2">
                  {studyTimeData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-400">{item.name}</span>
                      </div>
                      <span className="text-gray-200 font-medium">{item.hours}h</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                    Recent Activity
                  </h3>
                  <span className="text-xs text-gray-500">{recentActivity.length} items</span>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((item) => {
                    const { icon: ActIcon, color, bg } = getActivityIcon(item.type);
                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-dark-800/80 transition-colors"
                      >
                        <div className={`${bg} ${color} p-2 rounded-lg shrink-0`}>
                          <ActIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-200 truncate">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500">{item.detail}</p>
                        </div>
                        <span className="text-[10px] text-gray-600 shrink-0">
                          {item.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-300 mb-1">
                      AI Insight
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {stats?.totalQuizzes > 0
                        ? `You've completed ${stats.totalQuizzes} quizzes with an average score of ${stats.avgQuizScore}%. ${stats.streak > 0 ? `Keep your ${stats.streak}-day study streak alive!` : "Start a study streak today!"}`
                        : "Complete a few quizzes to get personalized AI insights about your performance."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
