import { CheckCircle, CircleDot, Circle, ChevronRight } from "lucide-react";

const colorMap = {
  indigo: { bar: "bg-indigo-500", text: "text-indigo-400", light: "bg-indigo-500/10", border: "border-indigo-500/20", dot: "bg-indigo-500" },
  green: { bar: "bg-green-500", text: "text-green-400", light: "bg-green-500/10", border: "border-green-500/20", dot: "bg-green-500" },
  orange: { bar: "bg-orange-500", text: "text-orange-400", light: "bg-orange-500/10", border: "border-orange-500/20", dot: "bg-orange-500" },
  pink: { bar: "bg-pink-500", text: "text-pink-400", light: "bg-pink-500/10", border: "border-pink-500/20", dot: "bg-pink-500" },
  cyan: { bar: "bg-cyan-500", text: "text-cyan-400", light: "bg-cyan-500/10", border: "border-cyan-500/20", dot: "bg-cyan-500" },
};

export default function SubjectCard({ subject, onClick }) {
  const colors = colorMap[subject.color] || colorMap.indigo;

  const total = subject.chapters.length;
  const completed = subject.chapters.filter((c) => c.status === "completed").length;
  const learning = subject.chapters.filter((c) => c.status === "learning").length;
  const notStarted = subject.chapters.filter((c) => c.status === "not-started").length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Circular progress
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-dark-800/50 border border-dark-700 rounded-2xl p-5 hover:border-dark-500 hover:bg-dark-800/80 transition-all duration-200 hover:scale-[1.02] group cursor-pointer"
    >
      {/* Color accent bar */}
      <div className={`h-1.5 rounded-full ${colors.bar} mb-4 w-16`} />

      {/* Progress ring + name */}
      <div className="flex items-start gap-4">
        {/* Circular progress */}
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
            <circle
              cx="36"
              cy="36"
              r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth="5"
            />
            <circle
              cx="36"
              cy="36"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={colors.text}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${colors.text}`}>{percent}%</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1">{subject.name}</h3>
          <p className="text-xs text-gray-500 mb-3">
            {completed}/{total} chapters
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-green-400">
              <CheckCircle className="w-3 h-3" /> {completed}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
              <CircleDot className="w-3 h-3" /> {learning}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <Circle className="w-3 h-3" /> {notStarted}
            </span>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors shrink-0 mt-1" />
      </div>
    </button>
  );
}
