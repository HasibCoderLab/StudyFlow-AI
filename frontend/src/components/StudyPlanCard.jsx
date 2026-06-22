import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

export default function StudyPlanCard({ plan }) {
  // Find today's entry from the plan
  const todayStr = new Date().toISOString().split("T")[0];
  const todayEntry = plan?.days?.find((d) => {
    const dStr = new Date(d.date).toISOString().split("T")[0];
    return dStr === todayStr;
  });

  // If no plan or no entry for today, show empty state
  if (!todayEntry || !todayEntry.tasks || todayEntry.tasks.length === 0) {
    return (
      <div className="bg-gradient-to-br from-indigo-600/50 to-indigo-700/30 rounded-2xl p-5 sm:p-6 border border-indigo-500/20">
        <p className="text-xs font-medium text-indigo-200/80 uppercase tracking-wider mb-1">
          Today's Study Plan
        </p>
        <p className="text-sm text-indigo-200/60">
          {plan ? "No tasks scheduled for today" : "Generate a study plan to get started"}
        </p>
      </div>
    );
  }

  const subject = todayEntry.tasks[0]?.subject || "Study";
  const totalTime = todayEntry.tasks.reduce((sum, t) => {
    const mins = parseInt(t.duration) || 30;
    return sum + mins;
  }, 0);

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700 rounded-2xl p-5 sm:p-6 shadow-lg shadow-indigo-500/15 border border-indigo-500/20">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-indigo-200/80 uppercase tracking-wider">
            Today's Study Plan
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
            {subject}
          </h3>
        </div>
        <span className="px-2.5 py-1 bg-white/15 text-white text-xs font-medium rounded-full backdrop-blur-sm">
          {totalTime} min
        </span>
      </div>

      <div className="space-y-2.5 mb-4">
        {todayEntry.tasks.map((task, i) => (
          <div key={i} className="flex items-center gap-2.5">
            {task.completed ? (
              <CheckCircle2 className="w-4 h-4 text-green-300 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-indigo-200/50 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <span
                className={`text-sm ${
                  task.completed ? "text-indigo-200/70 line-through" : "text-white/90"
                }`}
              >
                {task.topic}
              </span>
              <span className="text-xs text-indigo-200/50 ml-2">{task.duration}</span>
            </div>
          </div>
        ))}
      </div>

      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-200 hover:text-white transition-colors group"
      >
        View Full Plan
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </a>
    </div>
  );
}
