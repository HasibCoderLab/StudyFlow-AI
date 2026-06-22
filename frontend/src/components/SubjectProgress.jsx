import { useState, useEffect } from "react";
import { getSubjects } from "../api/subjects";

const subjectColors = [
  { color: "text-indigo-400", barColor: "bg-indigo-400" },
  { color: "text-green-400", barColor: "bg-green-500" },
  { color: "text-orange-400", barColor: "bg-orange-500" },
  { color: "text-pink-400", barColor: "bg-pink-500" },
  { color: "text-cyan-400", barColor: "bg-cyan-500" },
  { color: "text-yellow-400", barColor: "bg-yellow-500" },
  { color: "text-purple-400", barColor: "bg-purple-500" },
];

export default function SubjectProgress() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getSubjects()
      .then((res) => {
        if (!cancelled) setSubjects(res.data || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50 animate-pulse">
        <div className="h-4 w-32 bg-dark-600 rounded mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-4">
            <div className="h-3 w-20 bg-dark-600 rounded mb-2" />
            <div className="h-2.5 bg-dark-700 rounded-full"><div className="h-full w-1/2 bg-dark-600 rounded-full" /></div>
          </div>
        ))}
      </div>
    );
  }

  if (subjects.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
      <h3 className="text-sm font-semibold text-gray-200 mb-4 uppercase tracking-wider">
        Subject Performance
      </h3>
      <div className="space-y-4">
        {subjects.map((subj, i) => {
          const colors = subjectColors[i % subjectColors.length];
          // Use totalChapters as a rough progress indicator, capped at 100%
          const progress = Math.min((subj.totalChapters || 0) * 15, 100);
          return (
            <div key={subj._id}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-medium text-gray-300">
                  {subj.name}
                </span>
                <span className={`text-sm font-bold ${colors.color}`}>
                  {progress}%
                </span>
              </div>
              <div className="h-2.5 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors.barColor} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
