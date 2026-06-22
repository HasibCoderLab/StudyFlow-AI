import TaskRow from "./TaskRow";

export default function DayCard({ day, onToggleTask }) {
  const todayStr = new Date().toDateString();
  const dayDate = new Date(day.date);
  const isPast = dayDate < new Date(new Date().toDateString());
  const isToday = dayDate.toDateString() === todayStr;

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
        isToday
          ? "border-indigo-500/50 bg-dark-800/80 shadow-md shadow-indigo-500/10"
          : isPast
            ? "border-dark-700 bg-dark-800/30"
            : "border-dark-700 bg-dark-800/50 hover:border-dark-600"
      }`}
    >
      {/* Day header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${isToday ? "text-indigo-300" : "text-gray-200"}`}>
            Day {day.dayNumber}
          </span>
          <span className="text-xs text-gray-500">
            — {dayDate.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" })}
          </span>
          {isToday && (
            <span className="px-2 py-0.5 text-[10px] font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-500/20 rounded-full">
              Today
            </span>
          )}
        </div>
        {isToday && day.tasks && (
          <span className="text-xs text-gray-500">
            {day.tasks.filter((t) => t.done).length}/{day.tasks.length} done
          </span>
        )}
      </div>

      {/* Tasks */}
      <div className="space-y-0.5">
        {day.tasks?.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            isPast={isPast && !task.done}
          />
        ))}
      </div>

      {/* Today's progress bar */}
      {isToday && day.tasks && (
        <div className="mt-3 h-1.5 bg-dark-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500"
            style={{
              width: `${day.tasks.length > 0 ? (day.tasks.filter((t) => t.done).length / day.tasks.length) * 100 : 0}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
