import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const todayLabel = dayLabels[new Date().getDay()];

function buildChartData(weeklyLog) {
  if (!weeklyLog || !weeklyLog.dailyBreakdown) {
    return dayLabels.map((day) => ({ day, hours: 0 }));
  }
  return dayLabels.map((day) => {
    // Find the date string for this day of the week
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const target = new Date(startOfWeek);
    target.setDate(startOfWeek.getDate() + dayLabels.indexOf(day));
    const key = target.toISOString().split("T")[0];
    return {
      day,
      hours: weeklyLog.dailyBreakdown[key] || 0,
    };
  });
}

export default function WeeklyChart({ weeklyLog }) {
  const data = buildChartData(weeklyLog);

  return (
    <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
          Weekly Activity
        </h3>
        <span className="text-xs text-gray-500">Hours studied</span>
      </div>

      <div className="h-48 sm:h-56">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={data} barCategoryGap="30%" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 11, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              domain={[0, "auto"]}
              allowDecimals={false}
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
              cursor={{ fill: "rgba(99,102,241,0.08)" }}
              formatter={(value) => [`${value}h`, "Studied"]}
            />
            <Bar
              dataKey="hours"
              radius={[6, 6, 0, 0]}
              barSize={28}
              shape={(props) => {
                const { x, y, width, height, payload } = props;
                const isToday = payload.day === todayLabel;
                const fill = isToday ? "url(#todayGrad)" : "url(#defaultGrad)";
                const opacity = isToday ? 1 : 0.5;
                return (
                  <rect x={x} y={y} width={width} height={height} fill={fill} rx={6} ry={6} opacity={opacity} />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="todayGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="defaultGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
