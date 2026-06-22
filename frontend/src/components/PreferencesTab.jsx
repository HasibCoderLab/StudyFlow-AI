import { useState } from "react";
import { Moon, Sun, Clock, Clock3, Globe } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import Toast from "./Toast";

export default function PreferencesTab() {
  const [darkMode, setDarkMode] = useState(true);
  const [reminderTime, setReminderTime] = useState("19:00");
  const [sessionLength, setSessionLength] = useState("45");
  const [language, setLanguage] = useState("English");
  const [toast, setToast] = useState(null);

  const handleSave = () => {
    setToast("Preferences saved");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Preferences</h2>
        <p className="text-sm text-gray-400 mt-1">Customize your StudyFlow experience</p>
      </div>

      {/* Dark/Light Mode */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            {darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-yellow-400" />}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">Dark Mode</p>
            <p className="text-xs text-gray-500">{darkMode ? "Dark theme is active" : "Light theme is active (coming soon)"}</p>
          </div>
        </div>
        <ToggleSwitch enabled={darkMode} onChange={setDarkMode} />
      </div>

      {/* Daily Reminder Time */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">Daily Study Reminder</p>
            <p className="text-xs text-gray-500">Get reminded to study every day</p>
          </div>
        </div>
        <input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className="px-3 py-1.5 bg-dark-800 border border-dark-600 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 cursor-pointer"
        />
      </div>

      {/* Default Session Length */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Clock3 className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">Default Session Length</p>
            <p className="text-xs text-gray-500">How long each study session lasts</p>
          </div>
        </div>
        <select
          value={sessionLength}
          onChange={(e) => setSessionLength(e.target.value)}
          className="px-3 py-1.5 bg-dark-800 border border-dark-600 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
        >
          <option value="25" className="bg-dark-800">25 min</option>
          <option value="45" className="bg-dark-800">45 min</option>
          <option value="60" className="bg-dark-800">60 min</option>
        </select>
      </div>

      {/* Language */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Globe className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">Language</p>
            <p className="text-xs text-gray-500">App interface language</p>
          </div>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-1.5 bg-dark-800 border border-dark-600 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
        >
          <option value="English" className="bg-dark-800">English</option>
          <option value="Bangla" className="bg-dark-800">Bangla</option>
        </select>
      </div>

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-200 shadow-md shadow-indigo-500/20 cursor-pointer"
      >
        Save Preferences
      </button>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
