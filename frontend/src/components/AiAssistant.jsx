import { useState } from "react";
import { MessageSquare, ClipboardCheck } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ChatTab from "./ChatTab";
import QuizTab from "./QuizTab";

const tabs = [
  { id: "chat", label: "Ask AI", icon: MessageSquare },
  { id: "quiz", label: "Quiz Generator", icon: ClipboardCheck },
];

export default function AiAssistant({ defaultTab = "chat" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Sidebar />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Topbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-12 flex flex-col">
          {/* Tab toggle */}
          <div className="flex items-center gap-1 bg-dark-800/80 border border-dark-700 rounded-2xl p-1.5 w-fit mb-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content with animation */}
          <div
            className="flex-1 transition-all duration-300"
            key={activeTab}
            style={{
              animation: "fade-in 0.25s ease-out",
            }}
          >
            {activeTab === "chat" && <ChatTab />}
            {activeTab === "quiz" && <QuizTab />}
          </div>
        </main>
      </div>
    </div>
  );
}
