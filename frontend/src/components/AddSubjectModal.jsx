import { useState } from "react";
import { X } from "lucide-react";

const colorOptions = [
  { id: "indigo", class: "bg-indigo-500", ring: "ring-indigo-400" },
  { id: "green", class: "bg-green-500", ring: "ring-green-400" },
  { id: "orange", class: "bg-orange-500", ring: "ring-orange-400" },
  { id: "pink", class: "bg-pink-500", ring: "ring-pink-400" },
  { id: "cyan", class: "bg-cyan-500", ring: "ring-cyan-400" },
];

export default function AddSubjectModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [totalChapters, setTotalChapters] = useState(10);
  const [color, setColor] = useState("indigo");

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({
      name: trimmed,
      totalChapters,
      color,
    });
    onClose();
  };

  const canSave = name.trim().length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl p-6 animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Add Subject</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            {/* Subject name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Subject Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Physics"
                className="w-full px-4 py-2.5 bg-dark-900 border border-dark-600 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50"
                autoFocus
              />
            </div>

            {/* Total chapters */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Total Chapters
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={totalChapters}
                onChange={(e) => setTotalChapters(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                className="w-full px-4 py-2.5 bg-dark-900 border border-dark-600 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50"
              />
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Accent Color
              </label>
              <div className="flex gap-3">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setColor(opt.id)}
                    className={`w-9 h-9 rounded-xl ${opt.class} transition-all duration-200 cursor-pointer ${
                      color === opt.id
                        ? `ring-2 ${opt.ring} ring-offset-2 ring-offset-dark-800 scale-110`
                        : "hover:scale-105 opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`Color: ${opt.id}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-400 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-xl transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Save Subject
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
