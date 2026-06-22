import { useState } from "react";
import {
  User,
  Key,
  Settings2,
  Bell,
  Crown,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ProfileTab from "./ProfileTab";
import AccountTab from "./AccountTab";
import PreferencesTab from "./PreferencesTab";
import NotificationsTab from "./NotificationsTab";
import SubscriptionTab from "./SubscriptionTab";
import DangerZoneTab from "./DangerZoneTab";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Key },
  { id: "preferences", label: "Preferences", icon: Settings2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "subscription", label: "Subscription", icon: Crown },
  { id: "danger-zone", label: "Danger Zone", icon: AlertTriangle },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileTabOpen, setMobileTabOpen] = useState(false);

  const activeTabData = tabs.find((t) => t.id === activeTab);
  const ActiveIcon = activeTabData?.icon;

 	return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Sidebar />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Topbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-12">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Settings</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your account, preferences, and more</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* ── Tab Navigation (Desktop: vertical sidebar; Mobile: dropdown) ── */}
            {/* Desktop tabs */}
            <div className="hidden lg:flex flex-col w-56 shrink-0">
              <nav className="space-y-1 sticky top-24">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left cursor-pointer ${
                        isActive
                          ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/20"
                          : "text-gray-400 hover:text-gray-200 hover:bg-dark-700/50 border border-transparent"
                      }`}
                    >
                      <tab.icon className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-indigo-400" : "text-gray-500"
                      }`} />
                      <span>{tab.label}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Mobile tab dropdown */}
            <div className="lg:hidden relative">
              <button
                type="button"
                onClick={() => setMobileTabOpen(!mobileTabOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-sm font-medium text-gray-200 transition-all duration-200 cursor-pointer"
              >
                {ActiveIcon && <ActiveIcon className="w-4 h-4 text-indigo-400" />}
                <span>{activeTabData?.label}</span>
                <ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
              </button>
              {mobileTabOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-dark-800 border border-dark-700 rounded-xl shadow-xl z-30 overflow-hidden animate-slide-up">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab.id);
                          setMobileTabOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 text-left cursor-pointer ${
                          isActive
                            ? "bg-indigo-600/15 text-indigo-300"
                            : "text-gray-400 hover:text-gray-200 hover:bg-dark-700/50"
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Content Panel ── */}
            <div className="flex-1 min-w-0">
              <div className="p-5 sm:p-6 rounded-2xl border border-dark-700 bg-dark-800/50 animate-fade-in">
                {activeTab === "profile" && <ProfileTab />}
                {activeTab === "account" && <AccountTab />}
                {activeTab === "preferences" && <PreferencesTab />}
                {activeTab === "notifications" && <NotificationsTab />}
                {activeTab === "subscription" && <SubscriptionTab />}
                {activeTab === "danger-zone" && <DangerZoneTab />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
