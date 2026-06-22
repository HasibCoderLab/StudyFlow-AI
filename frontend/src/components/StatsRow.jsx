import { Flame, Star, Target, Clock } from "lucide-react";

const defaultStats = [
  { icon: Flame, label: "Study Streak", value: "0", unit: "days", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/15" },
  { icon: Star, label: "Points", value: "0", unit: "XP", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/15" },
  { icon: Target, label: "Quiz Score Avg", value: "0", unit: "%", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/15" },
  { icon: Clock, label: "Hours This Week", value: "0", unit: "h", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/15" },
];

export default function StatsRow({ stats }) {
  const data = stats
    ? [
        { ...defaultStats[0], value: String(stats.streak || 0) },
        { ...defaultStats[1], value: stats.points || "0" },
        { ...defaultStats[2], value: String(stats.avgQuizScore || 0) },
        { ...defaultStats[3], value: String(stats.hoursThisWeek || 0) },
      ]
    : defaultStats;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {data.map((stat, i) => (
        <div
          key={i}
          className={`${stat.bg} ${stat.border} border rounded-xl p-4 hover:scale-[1.02] transition-transform duration-200`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={`${stat.color} ${stat.bg} p-1.5 rounded-lg`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stat.value}
            <span className="text-sm font-normal text-gray-400 ml-1">{stat.unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
