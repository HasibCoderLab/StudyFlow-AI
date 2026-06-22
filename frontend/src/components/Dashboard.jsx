import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import StudyPlanCard from "./StudyPlanCard";
import StatsRow from "./StatsRow";
import SubjectProgress from "./SubjectProgress";
import WeeklyChart from "./WeeklyChart";
import TaskList from "./TaskList";
import AITipCard from "./AITipCard";
import { getDashboardStats } from "../api/dashboard";
import { getCurrentPlan } from "../api/studyPlan";
import { getWeeklySummary } from "../api/studyLogs";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [plan, setPlan] = useState(null);
  const [weeklyLog, setWeeklyLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [statsRes, planRes, weeklyRes] = await Promise.allSettled([
          getDashboardStats(),
          getCurrentPlan(),
          getWeeklySummary(),
        ]);
        if (cancelled) return;
        if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
        if (planRes.status === "fulfilled") setPlan(planRes.value.data);
        if (weeklyRes.status === "fulfilled") setWeeklyLog(weeklyRes.value.data);
      } catch (err) {
        if (!cancelled) setError("Failed to load dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <Sidebar />
        <div className="lg:ml-64 flex flex-col min-h-screen">
          <Topbar />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl bg-dark-800/50 border border-dark-700 p-5 animate-pulse">
                    <div className="h-4 w-1/3 bg-dark-600 rounded mb-3" />
                    <div className="h-3 w-2/3 bg-dark-600 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-dark-600 rounded" />
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-2xl bg-dark-800/50 border border-dark-700 p-5 animate-pulse">
                    <div className="h-4 w-1/2 bg-dark-600 rounded mb-3" />
                    <div className="h-3 w-full bg-dark-600 rounded mb-2" />
                    <div className="h-3 w-3/4 bg-dark-600 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <Sidebar />
        <div className="lg:ml-64 flex flex-col min-h-screen">
          <Topbar />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-400 text-sm mb-2">{error}</p>
              <button onClick={() => window.location.reload()} className="text-indigo-400 text-sm hover:text-indigo-300 cursor-pointer">
                Try again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Sidebar />

      <div className="lg:ml-64 flex flex-col min-h-screen">
          <Topbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <StudyPlanCard plan={plan} />
              <StatsRow stats={stats} />
              <WeeklyChart weeklyLog={weeklyLog} />
            </div>
            <div className="space-y-6">
              <SubjectProgress />
              <TaskList plan={plan} />
              <AITipCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
