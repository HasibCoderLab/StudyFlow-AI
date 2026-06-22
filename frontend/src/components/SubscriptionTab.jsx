import { useState } from "react";
import { Crown, AlertTriangle, X as XIcon } from "lucide-react";

const freeFeatures = ["Up to 3 subjects", "10 quizzes/month", "Basic analytics", "AI chat (limited)"];
const proFeatures = ["Unlimited subjects", "Unlimited quizzes", "Advanced analytics", "Full AI assistant", "Study planner AI", "Priority support"];

export default function SubscriptionTab() {
  const [showCancelModal, setShowCancelModal] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Subscription</h2>
        <p className="text-sm text-gray-400 mt-1">Manage your plan and billing</p>
      </div>

      {/* Current Plan Card */}
      <div className="p-5 sm:p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center">
              <Crown className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Pro Plan</h3>
                <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-400">$5/month — Renews on July 18, 2026</p>
            </div>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-200 shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            Manage Billing
          </button>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="p-5 sm:p-6 rounded-2xl border border-dark-700 bg-dark-800/50">
        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Plan Comparison</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Header */}
          <div className="col-span-1" />
          <div className="text-center">
            <p className="text-sm font-bold text-gray-400">Free</p>
            <p className="text-2xl font-extrabold text-white">$0</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-indigo-400">Pro</p>
            <p className="text-2xl font-extrabold text-indigo-400">$5</p>
            <p className="text-xs text-gray-500">/month</p>
          </div>

          {/* Rows */}
          {[
            { label: "Subjects", free: "Up to 3", pro: "Unlimited" },
            { label: "Quizzes", free: "10/month", pro: "Unlimited" },
            { label: "Analytics", free: "Basic", pro: "Advanced" },
            { label: "AI Assistant", free: "Limited", pro: "Full access" },
            { label: "Study Planner", free: "—", pro: "✓" },
            { label: "Priority Support", free: "—", pro: "✓" },
          ].map((row, i) => (
            <div key={i} className="col-span-3 grid grid-cols-3 gap-4 py-2.5 border-t border-dark-700">
              <span className="text-sm text-gray-300">{row.label}</span>
              <span className="text-sm text-gray-500 text-center">{row.free}</span>
              <span className="text-sm text-green-400 text-center">{row.pro}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade / Cancel */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 cursor-pointer"
        >
          Upgrade Plan
        </button>
        <button
          type="button"
          onClick={() => setShowCancelModal(true)}
          className="px-6 py-2.5 text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all duration-200 cursor-pointer"
        >
          Cancel Subscription
        </button>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <div className="relative bg-dark-800 border border-dark-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up">
            <button
              type="button"
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <XIcon className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Cancel Subscription?</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your Pro plan will remain active until the end of the current billing period (July 18, 2026). After that, you'll be downgraded to the Free plan.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-300 bg-dark-800 border border-dark-600 hover:bg-dark-700 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Keep My Plan
              </button>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
