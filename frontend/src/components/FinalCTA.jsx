import { useNavigate } from "react-router-dom";

export default function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section id="cta" className="py-20 md:py-28 bg-white dark:bg-dark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary-400/10 via-purple-400/10 to-accent-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-surface-900 dark:text-white mb-6 leading-tight">
          Start Your AI-Powered<br />
          Study Journey Today
        </h2>
        <p className="text-lg sm:text-xl text-surface-500 dark:text-dark-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of students who are studying smarter, achieving more,
          and feeling confident going into every exam.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/onboarding")}
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 rounded-2xl transition-all duration-200 shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/30 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
          >
            Get Started Free
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-surface-400 dark:text-dark-400 mt-4">
          ✦ No credit card required ✦ Cancel anytime ✦ 14-day free trial on Pro
        </p>
      </div>
    </section>
  );
}
