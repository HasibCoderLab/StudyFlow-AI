import { CheckCircle, Circle, CircleDot } from "lucide-react";

const statusConfig = {
  completed: {
    icon: CheckCircle,
    label: "Completed",
    className: "text-green-400 bg-green-500/10 border-green-500/20",
  },
  learning: {
    icon: CircleDot,
    label: "Learning",
    className: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  },
  "not-started": {
    icon: Circle,
    label: "Not Started",
    className: "text-gray-400 bg-gray-500/10 border-gray-500/20",
  },
};

const order = ["not-started", "learning", "completed"];

export default function StatusBadge({ status, onCycle }) {
  const config = statusConfig[status] || statusConfig["not-started"];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onCycle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-200 cursor-pointer hover:opacity-80 ${config.className}`}
      aria-label={`Status: ${config.label}. Click to change.`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </button>
  );
}
