const steps = [
  {
    number: "01",
    title: "Tell AI Your Goals",
    description: "Enter your subjects, syllabus, exam dates, and target score. StudyFlow AI builds a complete profile of your learning needs.",
    color: "from-primary-500 to-primary-600",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Get Your Study Plan",
    description: "Receive a day-by-day personalized study timetable. AI schedules topics optimally based on difficulty, deadlines, and your pace.",
    color: "from-accent-500 to-accent-600",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Track & Improve",
    description: "Study, take AI quizzes, and watch your progress. Get insights on weak topics, study streaks, and AI tutor help anytime.",
    color: "from-purple-500 to-purple-600",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-surface-500 dark:text-dark-300 max-w-2xl mx-auto">
            Three simple steps to transform the way you study.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-primary-400 via-accent-400 to-purple-400" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                {/* Step number circle */}
                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                  >
                    {step.icon}
                  </div>
                  {/* Animated ring */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400/30 to-purple-400/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-bold text-primary-500 dark:text-primary-400 uppercase tracking-widest">
                    Step {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-surface-900 dark:text-white mt-1 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-dark-400 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
