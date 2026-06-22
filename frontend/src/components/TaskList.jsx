import { CheckCircle2, Circle, CircleDot, ArrowRight } from "lucide-react";

const statusIcon = {
  completed: CheckCircle2,
  "in-progress": CircleDot,
  "not-started": Circle,
};
const statusColor = {
  completed: "text-green-400",
  "in-progress": "text-yellow-400",
  "not-started": "text-gray-500",
};

export default function TaskList({ plan }) {
  // Build a list of upcoming (incomplete) tasks across all days
  const upcomingTasks = [];
  if (plan?.days) {
    const now = new Date();
    for (const day of plan.days) {
      if (!day.tasks) continue;
      const dayDate = new Date(day.date);
      if (dayDate < now) continue; // skip past days
      for (const task of day.tasks) {
        if (!task.completed) {
          upcomingTasks.push({
            id: task._id || task.id || Math.random(),
            status: task.completed ? "completed" : "not-started",
            subject: task.subject,
            chapter: task.topic,
            date: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          });
        }
        if (upcomingTasks.length >= 5) break;
      }
      if (upcomingTasks.length >= 5) break;
    }
  }

  return (
    <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
      <h3 className="text-sm font-semibold text-gray-200 mb-4 uppercase tracking-wider">
        Upcoming Tasks
      </h3>
      <div className="space-y-3">
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task) => {
            const StatusIcon = statusIcon[task.status] || Circle;
            return (
              <div key={task.id} className="flex items-start gap-3">
                <StatusIcon className={`w-4 h-4 mt-0.5 shrink-0 ${statusColor[task.status] || "text-gray-500"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-200 truncate">{task.chapter}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-full">
                      {task.subject}
                    </span>
                    <span className="text-[10px] text-gray-500">{task.date}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">No upcoming tasks</p>
            <p className="text-xs text-gray-600 mt-1">
              {plan ? "All caught up!" : "Generate a study plan to see tasks"}
            </p>
          </div>
        )}
      </div>
      {upcomingTasks.length > 0 && (
        <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-3 transition-colors">
          View All <ArrowRight className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}
