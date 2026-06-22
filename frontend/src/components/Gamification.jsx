export default function Gamification() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-800 dark:via-dark-900 dark:to-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Visual gamification cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Streak Card */}
              <div className="relative bg-white dark:bg-dark-800 rounded-2xl p-5 border border-surface-200 dark:border-dark-700 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🔥</span>
                  <span className="text-sm font-semibold text-surface-500 dark:text-dark-300 uppercase tracking-wider">
                    Streak
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-surface-900 dark:text-white">
                  12 <span className="text-base font-normal text-surface-400 dark:text-dark-400">days</span>
                </p>
                <div className="flex gap-1 mt-3">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div
                      key={i}
                      className="flex-1 text-center"
                    >
                      <div
                        className={`h-8 rounded-lg mb-1 ${
                          i < 5
                            ? "bg-gradient-to-t from-primary-500 to-primary-400"
                            : i === 5
                              ? "bg-gradient-to-t from-primary-300 to-primary-200"
                              : "bg-surface-200 dark:bg-dark-600"
                        }`}
                      />
                      <span className="text-[10px] text-surface-400 dark:text-dark-500">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges Card */}
              <div className="relative bg-white dark:bg-dark-800 rounded-2xl p-5 border border-surface-200 dark:border-dark-700 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🏆</span>
                  <span className="text-sm font-semibold text-surface-500 dark:text-dark-300 uppercase tracking-wider">
                    Badges
                  </span>
                </div>
                <p className="text-sm font-medium text-surface-500 dark:text-dark-300 mb-3">
                  8 badges earned
                </p>
                <div className="flex flex-wrap gap-2">
                  {["🚀", "⭐", "🎯", "📚", "💪", "🔥", "🧠", "🏅"].map((b, i) => (
                    <span
                      key={i}
                      className="w-9 h-9 flex items-center justify-center bg-surface-100 dark:bg-dark-700 rounded-xl text-lg hover:scale-110 transition-transform cursor-default"
                      title={`Badge ${i + 1}`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Points Card */}
              <div className="relative bg-white dark:bg-dark-800 rounded-2xl p-5 border border-surface-200 dark:border-dark-700 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💎</span>
                  <span className="text-sm font-semibold text-surface-500 dark:text-dark-300 uppercase tracking-wider">
                    Points & Level
                  </span>
                </div>
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-3xl font-extrabold text-surface-900 dark:text-white">2,450</p>
                    <p className="text-xs text-surface-400 dark:text-dark-400">Total Points</p>
                  </div>
                  <div className="flex-1 mb-1">
                    <div className="flex justify-between text-xs text-surface-500 dark:text-dark-400 mb-1">
                      <span>Level 7</span>
                      <span>1,250 / 2,000 XP</span>
                    </div>
                    <div className="h-3 bg-surface-200 dark:bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full w-[62.5%] bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                    </div>
                    <p className="text-xs text-surface-400 dark:text-dark-400 mt-1">+120 points today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold mb-6">
              <span className="w-2 h-2 bg-primary-500 rounded-full" />
              Gamified Learning
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4 leading-tight">
              Studying Becomes Addictive When You Track It
            </h2>
            <p className="text-lg text-surface-500 dark:text-dark-300 mb-6 leading-relaxed">
              Turn your study routine into a game. Earn points for completing
              sessions, unlock badges for milestones, maintain streaks to stay
              consistent, and watch your level climb as you master more topics.
            </p>
            <ul className="space-y-3">
              {[
                { emoji: "🔥", text: "Maintain streaks to build momentum and consistency" },
                { emoji: "🏅", text: "Unlock badges for milestones and accomplishments" },
                { emoji: "📈", text: "Level up as you complete chapters and quizzes" },
                { emoji: "🎯", text: "Compete with friends and stay motivated together" },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-surface-700 dark:text-dark-200">
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
