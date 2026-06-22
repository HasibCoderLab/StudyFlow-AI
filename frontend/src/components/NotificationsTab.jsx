import { useState } from "react";
import { Bell } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

const notificationItems = [
  { id: "reminders", label: "Study Reminders", desc: "Get notified when it's time for your daily study session" },
  { id: "streak", label: "Streak Alerts", desc: "Reminders to keep your study streak alive" },
  { id: "progress", label: "Weekly Progress Report", desc: "Receive a summary of your study activity each week" },
  { id: "aiTips", label: "AI Tips & Suggestions", desc: "Get personalized AI recommendations for your weak areas" },
  { id: "quiz", label: "Quiz Reminders", desc: "Get notified about upcoming quizzes and practice tests" },
];

export default function NotificationsTab() {
  const [settings, setSettings] = useState({
    reminders: true,
    streak: true,
    progress: true,
    aiTips: false,
    quiz: true,
  });

  const handleToggle = (id, value) => {
    setSettings((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Notifications</h2>
        <p className="text-sm text-gray-400 mt-1">Manage what notifications you receive</p>
      </div>

      <div className="space-y-2">
        {notificationItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-dark-700 hover:bg-dark-800/80 transition-colors"
          >
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings[item.id]}
              onChange={(val) => handleToggle(item.id, val)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
