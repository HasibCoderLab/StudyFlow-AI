import { useState, useCallback, useEffect } from "react";
import { CalendarDays, Sparkles } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PlanGeneratorForm from "./PlanGeneratorForm";
import DayCard from "./DayCard";
import PlanSummaryPanel from "./PlanSummaryPanel";
import { getCurrentPlan, generatePlan as apiGeneratePlan, toggleTask } from "../api/studyPlan";

export default function StudyPlanner() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load existing plan on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getCurrentPlan();
        if (!cancelled && res.data) setPlan(res.data);
      } catch (e) {
        // No plan yet — that's fine
      } finally {
        if (!cancelled) setFetching(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleGenerate = useCallback(async (formData) => {
    setLoading(true);
    try {
      const res = await apiGeneratePlan(formData);
      setPlan(res.data);
    } catch (err) {
      console.error("Failed to generate plan:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegenerate = useCallback(async () => {
    if (!plan) return;
    // Derive subjects from tasks across all days (plan doc doesn't store subjects at top level)
    const subjectSet = new Set();
    plan.days?.forEach((day) => day.tasks?.forEach((t) => subjectSet.add(t.subject)));
    const subjectList = Array.from(subjectSet);

    setLoading(true);
    try {
      const res = await apiGeneratePlan({
        examDate: plan.examDate,
        subjects: subjectList,
        dailyHours: plan.dailyHours || 4,
      });
      setPlan(res.data);
    } catch (err) {
      console.error("Failed to regenerate plan:", err);
    } finally {
      setLoading(false);
    }
  }, [plan]);

  const handleToggleTask = useCallback(async (taskId) => {
    if (!plan) return;
    // Find which day this task belongs to
    for (let di = 0; di < plan.days.length; di++) {
      const task = plan.days[di].tasks?.find((t) => (t._id || t.id) === taskId);
      if (task) {
        // Optimistic update
        setPlan((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            days: prev.days.map((day, di2) => ({
              ...day,
              tasks: day.tasks.map((t) =>
                (t._id || t.id) === taskId ? { ...t, completed: !t.completed } : t
              ),
            })),
          };
        });
        try {
          await toggleTask(plan._id, di, taskId);
        } catch (err) {
          // Revert on failure
          setPlan((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              days: prev.days.map((day, di2) => ({
                ...day,
                tasks: day.tasks.map((t) =>
                  (t._id || t.id) === taskId ? { ...t, completed: !t.completed } : t
                ),
              })),
            };
          });
        }
        break;
      }
    }
  }, [plan]);

  // Transform plan days to match DayCard's expected format
  const transformedPlan = plan
    ? {
        ...plan,
        days: plan.days.map((day, di) => ({
          dayNumber: di + 1,
          date: new Date(day.date).toISOString().split("T")[0],
          tasks: (day.tasks || []).map((t) => ({
            id: t._id || t.id || `task-${di}-${Math.random()}`,
            subject: t.subject,
            topic: t.topic,
            time: t.duration || "30 min",
            done: t.completed || false,
          })),
        })),
        totalDays: plan.days.length,
      }
    : null;

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Sidebar />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Topbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Study Planner</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Let AI create a personalized day-by-day study schedule
                </p>
              </div>

              {!fetching && (
                <PlanGeneratorForm onGenerate={handleGenerate} loading={loading} />
              )}

              {/* Loading for initial fetch */}
              {fetching && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Empty state */}
              {!fetching && !plan && !loading && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mb-4">
                    <CalendarDays className="w-7 h-7 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No plan yet</h3>
                  <p className="text-sm text-gray-500 max-w-md">
                    Fill in the form above to generate your AI-powered study plan.
                  </p>
                </div>
              )}

              {/* Loading state */}
              {loading && !plan && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">AI is analyzing your syllabus...</h3>
                  <div className="w-48 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full animate-pulse" style={{ width: "50%" }} />
                  </div>
                </div>
              )}

              {/* Generated Plan */}
              {transformedPlan && !loading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Your Study Schedule ({transformedPlan.totalDays} days)
                    </h3>
                    <span className="text-xs text-gray-500">
                      {transformedPlan.days.filter((d) => new Date(d.date) <= new Date() && d.tasks?.some((t) => !t.done)).length} days remaining
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {transformedPlan.days.map((day) => (
                      <DayCard key={day.dayNumber} day={day} onToggleTask={handleToggleTask} />
                    ))}
                  </div>
                </div>
              )}

              {/* Loading during regeneration */}
              {loading && plan && (
                <div className="flex items-center justify-center py-8 text-center">
                  <div className="flex items-center gap-3 px-5 py-3 bg-dark-800 border border-dark-700 rounded-xl">
                    <svg className="w-5 h-5 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm text-gray-300">Regenerating your plan...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {transformedPlan && !loading && (
                <PlanSummaryPanel plan={transformedPlan} onRegenerate={handleRegenerate} loading={loading} />
              )}
              {!plan && !fetching && (
                <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
                  <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-3">Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span>Pick a realistic exam date</li>
                    <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span>Select all subjects you need to cover</li>
                    <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span>Set daily hours you can actually commit to</li>
                    <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span>You can regenerate anytime</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
