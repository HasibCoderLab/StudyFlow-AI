import { CheckCircle2, Circle } from "lucide-react";

const subjectMeta = {
  physics: { label: "Physics", color: "text-indigo-300", bg: "bg-indigo-500/15 border-indigo-500/20" },
  chemistry: { label: "Chemistry", color: "text-green-300", bg: "bg-green-500/15 border-green-500/20" },
  biology: { label: "Biology", color: "text-orange-300", bg: "bg-orange-500/15 border-orange-500/20" },
  math: { label: "Math", color: "text-purple-300", bg: "bg-purple-500/15 border-purple-500/20" },
};

export default function TaskRow({ task, onToggle, isPast }) {
  const meta = subjectMeta[task.subject] || { label: task.subject, color: "text-gray-300", bg: "bg-gray-500/15 border-gray-500/20" };

  return (
    <div className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-colors -mx-1 ${
      isPast ? "opacity-50" : "hover:bg-dark-700/30"
    }`}>
      <button
        type="button"
        onClick={() => onToggle?.(task.id)}
        className="shrink-0 cursor-pointer focus:outline-none"
        aria-label={task.done ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.done ? (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        ) : (
          <Circle className="w-5 h-5 text-gray-500 hover:text-gray-300 transition-colors" />
        )}
      </button>

      <span className={`flex-1 text-sm ${task.done ? "text-gray-500 line-through" : "text-gray-200"}`}>
        {task.topic}
      </span>

      <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${meta.bg} ${meta.color}`}>
        {meta.label}
      </span>

      <span className="shrink-0 text-xs text-gray-500 w-10 text-right">{task.time}</span>
    </div>
  );
}
