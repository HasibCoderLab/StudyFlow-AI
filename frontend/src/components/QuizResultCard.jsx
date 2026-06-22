import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

export default function QuizResultCard({ score, total, onRetry }) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  const getGrade = () => {
    if (percent >= 80) return { label: "Excellent! 🎉", color: "text-green-400" };
    if (percent >= 60) return { label: "Good job! 👍", color: "text-yellow-400" };
    if (percent >= 40) return { label: "Keep practicing! 💪", color: "text-orange-400" };
    return { label: "Need more revision 📚", color: "text-red-400" };
  };

  const grade = getGrade();

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-dark-700 bg-dark-800/50 text-center animate-slide-up">
      {/* Result icon */}
      <div className="mb-4">
        {percent >= 60 ? (
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
        ) : (
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        )}
      </div>

      <h3 className={`text-xl font-bold ${grade.color} mb-2`}>{grade.label}</h3>

      <div className="flex items-baseline justify-center gap-1.5 mb-1">
        <span className="text-4xl font-extrabold text-white">{score}</span>
        <span className="text-lg text-gray-400">/ {total}</span>
      </div>
      <p className="text-sm text-gray-500 mb-6">{percent}% correct</p>

      {/* Mini bar */}
      <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden mb-6">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            percent >= 80
              ? "bg-green-500"
              : percent >= 60
                ? "bg-yellow-500"
                : percent >= 40
                  ? "bg-orange-500"
                  : "bg-red-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl transition-all duration-200 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        Retry Quiz
      </button>
    </div>
  );
}
