import { useState } from "react";
import { X, Plus, ArrowLeft } from "lucide-react";
import ChapterRow from "./ChapterRow";
import Toast from "./Toast";
import { createChapter, updateChapterStatus } from "../api/chapters";

export default function ChapterDrawer({ subject, onClose, onUpdateSubject }) {
  const [newChapterName, setNewChapterName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!subject) return null;

  const statusCounts = {
    completed: subject.chapters.filter((c) => c.status === "completed").length,
    learning: subject.chapters.filter((c) => c.status === "learning").length,
    "not-started": subject.chapters.filter((c) => c.status === "not-started").length,
  };

  const total = subject.chapters.length;
  const completed = statusCounts.completed;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleCycleStatus = async (chapterId, newStatus) => {
    // Optimistic local update
    const prevChapters = [...subject.chapters];
    onUpdateSubject?.({
      ...subject,
      chapters: subject.chapters.map((ch) =>
        (ch._id || ch.id) === chapterId ? { ...ch, status: newStatus } : ch
      ),
    });
    // Persist to backend
    try {
      await updateChapterStatus(chapterId, newStatus);
    } catch (err) {
      // Revert on failure
      onUpdateSubject?.({ ...subject, chapters: prevChapters });
      setError("Failed to update chapter status.");
    }
  };

  const handleAddChapter = async () => {
    const name = newChapterName.trim();
    if (!name || saving) return;
    setSaving(true);
    try {
      const res = await createChapter({ subjectId: subject._id || subject.id, name });
      const newChapter = res.data;
      onUpdateSubject?.({
        ...subject,
        chapters: [...subject.chapters, newChapter],
      });
      setNewChapterName("");
    } catch (err) {
      setError("Failed to create chapter.");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddChapter();
    }
  };

  const colorMap = {
    indigo: { bar: "bg-indigo-500", text: "text-indigo-400", light: "bg-indigo-500/10" },
    green: { bar: "bg-green-500", text: "text-green-400", light: "bg-green-500/10" },
    orange: { bar: "bg-orange-500", text: "text-orange-400", light: "bg-orange-500/10" },
    pink: { bar: "bg-pink-500", text: "text-pink-400", light: "bg-pink-500/10" },
    cyan: { bar: "bg-cyan-500", text: "text-cyan-400", light: "bg-cyan-500/10" },
  };
  const colors = colorMap[subject.color] || colorMap.indigo;

  return (
    <>
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] z-50 bg-dark-800 border-l border-dark-700 shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-white">{subject.name}</h2>
              <p className="text-xs text-gray-500">{total} chapters</p>
            </div>
          </div>
        </div>

        {/* Status summary */}
        <div className="px-5 py-3 border-b border-dark-700/50">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              {statusCounts.completed} Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              {statusCounts.learning} Learning
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-500" />
              {statusCounts["not-started"]} Not Started
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-2 bg-dark-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className={`text-xs ${colors.text} mt-1 font-medium`}>
            {completed}/{total} completed — {percent}%
          </p>
        </div>

        {/* Chapter list */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {subject.chapters.map((ch) => (
            <ChapterRow
              key={ch.id}
              chapter={ch}
              onCycleStatus={handleCycleStatus}
            />
          ))}

          {/* Add Chapter row */}
          <div className="flex items-center gap-2 py-2.5 px-3 mt-1">
            <div className="flex-1 flex items-center gap-2 bg-dark-700/50 border border-dark-600 rounded-xl px-3 py-2 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all duration-200">
              <Plus className="w-4 h-4 text-gray-500 shrink-0" />
              <input
                type="text"
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={saving}
                placeholder="Add new chapter..."
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none disabled:opacity-50"
              />
              {newChapterName.trim() && (
                <button
                  type="button"
                  onClick={handleAddChapter}
                  disabled={saving}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-40 cursor-pointer"
                >
                  {saving ? "..." : "Add"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
