import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  const scrollToSection = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/60 via-white to-white dark:from-dark-800/60 dark:via-dark-900 dark:to-dark-900 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold mb-6">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              AI-Powered Study Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-900 dark:text-white leading-[1.1] tracking-tight mb-6">
              Your Personal{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                AI Study Coach
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-surface-600 dark:text-dark-300 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              StudyFlow AI intelligently plans your study schedule, tracks your
              progress, and helps you master any subject with AI-powered
              tutoring and quizzes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/onboarding")}
                className="px-8 py-3.5 text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-2xl transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                Start Studying Smarter
              </button>
              <a
                href="#how-it-works"
                onClick={(e) => scrollToSection(e, "#how-it-works")}
                className="px-8 py-3.5 text-base font-semibold text-surface-700 dark:text-dark-200 bg-surface-100 dark:bg-dark-700 hover:bg-surface-200 dark:hover:bg-dark-600 rounded-2xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              >
                See How It Works
              </a>
            </div>
          </div>

          {/* Right: Mock Dashboard Preview */}
          <div className="relative animate-fade-in">
            <div className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-surface-200 dark:border-dark-700 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
              {/* Dashboard header */}
              <div className="flex items-center gap-2 px-5 py-3 bg-surface-50 dark:bg-dark-700 border-b border-surface-200 dark:border-dark-600">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-2 text-xs text-surface-400 dark:text-dark-400">StudyFlow AI — Dashboard</span>
              </div>

              {/* Dashboard content */}
              <div className="p-5 sm:p-6 space-y-5">
                {/* Greeting */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-surface-400 dark:text-dark-400">Welcome back,</p>
                    <p className="text-sm font-bold text-surface-900 dark:text-white">Alex 👋</p>
                  </div>
                  <div className="flex -space-x-1.5">
                    <div className="w-7 h-7 rounded-full bg-primary-200 dark:bg-primary-800 border-2 border-white dark:border-dark-800" />
                    <div className="w-7 h-7 rounded-full bg-accent-200 dark:bg-accent-800 border-2 border-white dark:border-dark-800" />
                    <div className="w-7 h-7 rounded-full bg-orange-200 dark:bg-orange-800 border-2 border-white dark:border-dark-800" />
                  </div>
                </div>

                {/* Study Plan Card */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-4 text-white">
                  <p className="text-xs font-medium text-white/80">Today's Study Plan</p>
                  <p className="text-lg font-bold mt-1">Mathematics — Chapter 5</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs bg-white/20 rounded-full px-2.5 py-0.5">45 min</span>
                    <span className="text-xs bg-white/20 rounded-full px-2.5 py-0.5">Quiz Ready</span>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-surface-600 dark:text-dark-300 font-medium">Physics</span>
                      <span className="text-surface-500 dark:text-dark-400 font-medium">68%</span>
                    </div>
                    <div className="h-2 bg-surface-100 dark:bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full w-[68%] bg-primary-500 rounded-full transition-all duration-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-surface-600 dark:text-dark-300 font-medium">Chemistry</span>
                      <span className="text-surface-500 dark:text-dark-400 font-medium">42%</span>
                    </div>
                    <div className="h-2 bg-surface-100 dark:bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full w-[42%] bg-accent-500 rounded-full transition-all duration-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-surface-600 dark:text-dark-300 font-medium">Biology</span>
                      <span className="text-surface-500 dark:text-dark-400 font-medium">85%</span>
                    </div>
                    <div className="h-2 bg-surface-100 dark:bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-orange-500 rounded-full transition-all duration-500" />
                    </div>
                  </div>
                </div>

                {/* Streak + Stats row */}
                <div className="flex gap-3">
                  <div className="flex-1 bg-surface-50 dark:bg-dark-700/50 rounded-xl p-3 border border-surface-100 dark:border-dark-700">
                    <p className="text-xs text-surface-400 dark:text-dark-400">Study Streak</p>
                    <p className="text-xl font-bold text-surface-900 dark:text-white">
                      12 <span className="text-sm font-normal text-surface-500 dark:text-dark-400">days</span>
                    </p>
                    <div className="flex gap-0.5 mt-1.5">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-full h-1.5 rounded-full ${
                            i < 5
                              ? "bg-primary-500"
                              : i === 5
                                ? "bg-primary-300"
                                : "bg-surface-200 dark:bg-dark-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 bg-surface-50 dark:bg-dark-700/50 rounded-xl p-3 border border-surface-100 dark:border-dark-700">
                    <p className="text-xs text-surface-400 dark:text-dark-400">Points</p>
                    <p className="text-xl font-bold text-surface-900 dark:text-white">2,450</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="text-xs text-accent-600 dark:text-accent-400 font-medium">+120 today</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-surface-50 dark:bg-dark-700/50 rounded-xl p-3 border border-surface-100 dark:border-dark-700">
                    <p className="text-xs text-surface-400 dark:text-dark-400">Quiz Score</p>
                    <p className="text-xl font-bold text-surface-900 dark:text-white">85%</p>
                    <p className="text-xs text-surface-500 dark:text-dark-400 mt-0.5">Last 5 tests</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge decoration */}
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-accent-500 rounded-2xl rotate-12 shadow-lg flex items-center justify-center hidden sm:flex animate-float">
              <span className="text-white text-xs font-bold text-center leading-tight">
                AI<br/>Powered
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
