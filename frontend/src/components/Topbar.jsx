import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();
  const userName = user?.name;

  return (
    <header className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-lg border-b border-dark-700">
      <div className="flex items-center justify-between pl-14 lg:pl-6 pr-4 sm:pr-6 lg:pr-8 py-3">
        <div>
          <p className="text-sm text-gray-400">
            Welcome back,{" "}
            <span className="font-semibold text-white">{userName || "User"}</span>
            <span className="ml-1">👋</span>
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Keep up the great momentum!</p>
        </div>

        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold ring-2 ring-dark-800">
            {(userName || "U")[0].toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
