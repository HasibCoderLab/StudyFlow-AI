import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { RotateCcw } from "lucide-react";

const subjectColors = {
  physics: "#6366f1",
  chemistry: "#22c55e",
  biology: "#f97316",
  math: "#a855f7",
};

const subjectLabels = {
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  math: "Mathematics",
};

export default function PlanSummaryPanel({ plan, onRegenerate, loading }) {
  if (!plan) return null;

  const { totalDays, days } = plan;

  // Count total topics per subject for distribution
  const topicCount = {};
  days.forEach((day) => {
    day.tasks?.forEach((task) => {
      topicCount[task.subject] = (topicCount[task.subject] || 0) + 1;
    });
  });

  // Derive subjects from task data (plan doc doesn't store subjects at top level)
  const derivedSubjects = Object.keys(topicCount);

  const chartData = derivedSubjects.map((s) => ({
    name: subjectLabels[s.toLowerCase()] || s,
    value: topicCount[s] || 1,
    color: subjectColors[s.toLowerCase()] || "#6366f1",
  }));

  const totalTopics = days.reduce((sum, d) => sum + (d.tasks?.length || 0), 0);

  return (
    <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50 space-y-5">
      <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
        Plan Summary
      </h3>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Total Days</span>
          <span className="text-sm font-bold text-white">{totalDays} days</span>
        </div>
        <div className="h-px bg-dark-700" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Topics Covered</span>
          <span className="text-sm font-bold text-white">{totalTopics}</span>
        </div>
        <div className="h-px bg-dark-700" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Daily Hours</span>
          <span className="text-sm font-bold text-white">{plan.dailyHours}h</span>
        </div>
      </div>

      {/* Donut Chart */}
      {chartData.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
            Subject Distribution
          </p>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={42}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "#e2e8f0",
                    }}
                    formatter={(value, name) => [`${value} topics`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5">
              {chartData.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-gray-400 flex-1">{entry.name}</span>
                  <span className="text-xs text-gray-500">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Regenerate button */}
      <button
        type="button"
        onClick={onRegenerate}
        disabled={loading}
        className="w-full px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-xl transition-all duration-200 disabled:opacity-40 cursor-pointer"
      >
        <span className="flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Regenerate Plan
        </span>
      </button>
    </div>
  );
}
