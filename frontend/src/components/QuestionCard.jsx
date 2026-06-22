import { CheckCircle2, XCircle, Circle } from "lucide-react";

export default function QuestionCard({ question, index, selected, onSelect, showResults }) {
  const letters = ["A", "B", "C", "D"];

  const getOptionClass = (optIdx) => {
    const isSelected = selected === optIdx;
    if (!showResults) {
      return isSelected
        ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300"
        : "bg-dark-800 border-dark-600 text-gray-300 hover:border-gray-500 hover:bg-dark-700/50";
    }
    const isCorrect = optIdx === question.correct;
    if (isCorrect) {
      return "bg-green-500/15 border-green-500/40 text-green-300";
    }
    if (isSelected && !isCorrect) {
      return "bg-red-500/15 border-red-500/40 text-red-300";
    }
    return "bg-dark-800 border-dark-600 text-gray-500 opacity-60";
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-dark-700 bg-dark-800/50 space-y-4">
      {/* Question */}
      <div className="flex items-start gap-3">
        <span className="text-sm font-bold text-indigo-400 mt-0.5 shrink-0">
          Q{index + 1}.
        </span>
        <p className="text-sm text-gray-200">{question.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((opt, optIdx) => {
          const isSelected = selected === optIdx;
          const Icon = showResults
            ? optIdx === question.correct
              ? CheckCircle2
              : isSelected
                ? XCircle
                : Circle
            : isSelected
              ? CheckCircle2
              : Circle;

          const iconColor = showResults
            ? optIdx === question.correct
              ? "text-green-400"
              : isSelected
                ? "text-red-400"
                : "text-gray-500"
            : isSelected
              ? "text-indigo-400"
              : "text-gray-500";

          return (
            <button
              key={optIdx}
              type="button"
              onClick={() => !showResults && onSelect?.(index, optIdx)}
              disabled={showResults}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm text-left transition-all duration-200 cursor-pointer ${
                getOptionClass(optIdx)
              } ${showResults ? "cursor-default" : ""}`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
              <span className="text-xs font-bold text-gray-500 mr-0.5">{letters[optIdx]}.</span>
              <span className="text-sm">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
