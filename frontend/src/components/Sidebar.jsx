import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Library,
  Bot,
  ClipboardCheck,
  BarChart3,
  Settings,
  LogOut,
  X,
  Menu,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Study Planner", icon: BookOpen, path: "/planner" },
  { label: "Subjects", icon: Library, path: "/subjects" },
  { label: "AI Assistant", icon: Bot, path: "/ai-assistant" },
  { label: "Quiz", icon: ClipboardCheck, path: "/quiz" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <button onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-dark-800 border border-dark-700 rounded-xl p-2.5 text-gray-400 hover:text-white transition-colors shadow-lg"
        aria-label="Open sidebar"
      ><Menu className="w-5 h-5" /></button>

      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-dark-800/80 backdrop-blur-sm border-r border-dark-700 z-40">
        <SidebarContent user={user} onNavClick={() => {}} onLogout={handleLogout} navigate={navigate} pathname={location.pathname} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-dark-800 border-r border-dark-700 shadow-2xl animate-slide-in-right">
            <SidebarContent user={user} onNavClick={() => setMobileOpen(false)} onLogout={handleLogout} navigate={navigate} pathname={location.pathname} isMobile />
          </div>
        </div>
      )}
    </>
  );
}

function SidebarContent({ user, onLogout, onNavClick, navigate, pathname, isMobile }) {
  const initial = (user?.name || "U")[0].toUpperCase();
  const planBadge = user?.plan === "pro" ? "Pro" : "Free";

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-6 pb-4 flex items-center justify-between">
        <button onClick={() => { navigate("/"); onNavClick?.(); }} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/25">S</div>
          <span className="text-lg font-bold text-white">StudyFlow AI</span>
        </button>
        {isMobile && (
          <button onClick={onNavClick} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-dark-700 transition-colors" aria-label="Close sidebar">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
          return (
            <button key={item.label} onClick={() => { navigate(item.path); onNavClick(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group text-left ${
                isActive ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/20" : "text-gray-400 hover:text-gray-200 hover:bg-dark-700/50 border border-transparent"
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-300 transition-colors"}`} />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto text-indigo-400" />}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-dark-700 space-y-2">
        <button type="button" onClick={() => { navigate("/settings"); onNavClick(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-dark-700/50 transition-all duration-200 text-left cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-200 truncate">{user?.name || "User"}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${planBadge === "Pro" ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                {planBadge}
              </span>
              <span className="text-[10px] text-gray-500">Plan</span>
            </div>
          </div>
        </button>

        <button type="button" onClick={() => { onLogout?.(); onNavClick(); }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
