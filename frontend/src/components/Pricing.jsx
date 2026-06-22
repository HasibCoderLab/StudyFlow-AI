import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="py-16 md:py-24 bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-surface-500 dark:text-dark-300 max-w-2xl mx-auto">
            Start for free. Upgrade when you're ready for advanced AI features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="relative bg-white dark:bg-dark-800 rounded-2xl p-8 border border-surface-200 dark:border-dark-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Free</h3>
            <p className="text-sm text-surface-500 dark:text-dark-400 mb-6">
              Perfect for getting started
            </p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-surface-900 dark:text-white">$0</span>
              <span className="text-surface-400 dark:text-dark-400 ml-1">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "AI Study Planner (limited)",
                "Subject & Chapter Tracking",
                "Basic Progress Analytics",
                "5 AI Quiz Generations / month",
                "Community Badges",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-surface-600 dark:text-dark-300">
                  <svg className="w-5 h-5 text-accent-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/onboarding")}
              className="block w-full text-center px-6 py-3 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-xl transition-all duration-200 border border-primary-200 dark:border-primary-800 cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-white dark:bg-dark-800 rounded-2xl p-8 border-2 border-primary-500 shadow-lg shadow-primary-500/10 hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300 hover:-translate-y-1">
            {/* Most Popular badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex px-4 py-1 bg-primary-600 text-white text-xs font-bold rounded-full shadow-sm">
                Most Popular
              </span>
            </div>

            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Pro</h3>
            <p className="text-sm text-surface-500 dark:text-dark-400 mb-6">
              For serious students aiming high
            </p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-surface-900 dark:text-white">$5</span>
              <span className="text-surface-400 dark:text-dark-400 ml-1">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Unlimited AI Study Plans",
                "Smart Timetable Generator",
                "Advanced Performance Analytics",
                "Unlimited AI Quiz Generations",
                "AI Tutor / Study Assistant Chat",
                "Exam Readiness Prediction",
                "Mistake Tracker with AI Insights",
                "Priority Support",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-surface-600 dark:text-dark-300">
                  <svg className="w-5 h-5 text-accent-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/onboarding")}
              className="block w-full text-center px-6 py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
