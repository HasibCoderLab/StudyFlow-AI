import { useState } from "react";
import { Sparkles, X } from "lucide-react";

const allSubjects = [
  { id: "physics", label: "Physics", color: "text-indigo-400", bg: "bg-indigo-500/15 border-indigo-500/20" },
  { id: "chemistry", label: "Chemistry", color: "text-green-400", bg: "bg-green-500/15 border-green-500/20" },
  { id: "biology", label: "Biology", color: "text-orange-400", bg: "bg-orange-500/15 border-orange-500/20" },
  { id: "math", label: "Mathematics", color: "text-purple-400", bg: "bg-purple-500/15 border-purple-500/20" },
];

export default function PlanGeneratorForm({ onGenerate, loading }) {
  const [examDate, setExamDate] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [dailyHours, setDailyHours] = useState(4);

  const toggleSubject = (id) => {
    setSelectedSubjects((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (!examDate || selectedSubjects.length === 0) return;
    onGenerate({
      examDate,
      subjects: selectedSubjects,
      dailyHours,
    });
  };

  const canGenerate = examDate && selectedSubjects.length > 0;

  const getSubjectMeta = (id) => allSubjects.find((s) => s.id === id);

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-dark-700 bg-dark-800/50">
      <h2 className="text-lg font-bold text-white mb-1">Generate Your Study Plan</h2>
      <p className="text-sm text-gray-400 mb-5">
        Set your exam date, pick subjects, and let AI do the rest.
      </p>

      <div className="space-y-5">
        {/* Exam Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Exam Date
          </label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 [color-scheme:dark]"
          />
        </div>

        {/* Subjects */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Subjects
          </label>
          <div className="flex flex-wrap gap-2">
            {allSubjects.map((subj) => {
              const selected = selectedSubjects.includes(subj.id);
              return (
                <button
                  key={subj.id}
                  type="button"
                  onClick={() => toggleSubject(subj.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer ${
                    selected
                      ? `${subj.bg} ${subj.color}`
                      : "bg-dark-800 border-dark-600 text-gray-400 hover:border-gray-500 hover:text-gray-200"
                  }`}
                >
                  {selected && <X className="w-3.5 h-3.5" />}
                  {subj.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Hours Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-300">
              Daily Available Hours
            </label>
            <span className="text-sm text-indigo-400 font-semibold">{dailyHours}h</span>
          </div>
          <input
            type="range"
            min={1}
            max={8}
            step={0.5}
            value={dailyHours}
            onChange={(e) => setDailyHours(parseFloat(e.target.value))}
            className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-indigo-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500
              [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:shadow-indigo-500/30
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-indigo-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1h</span>
            <span>8h</span>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canGenerate || loading}
          className="w-full px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-lg cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              AI is creating your plan...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Plan with AI
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
