import { StickyNote } from "lucide-react";
import StatusBadge from "./StatusBadge";

const order = ["not-started", "learning", "completed"];

export default function ChapterRow({ chapter, onCycleStatus }) {
  const nextStatus = (current) => {
    const idx = order.indexOf(current);
    return order[(idx + 1) % order.length];
  };

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-dark-700/40 transition-colors -mx-1 group">
      {/* Chapter name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-200 truncate">{chapter.name}</p>
      </div>

      {/* Status badge */}
      <StatusBadge
        status={chapter.status}
        onCycle={() => onCycleStatus?.(chapter.id, nextStatus(chapter.status))}
      />

      {/* Add Note icon */}
      <button
        type="button"
        className="text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 cursor-pointer"
        aria-label={`Add note for ${chapter.name}`}
      >
        <StickyNote className="w-4 h-4" />
      </button>
    </div>
  );
}
