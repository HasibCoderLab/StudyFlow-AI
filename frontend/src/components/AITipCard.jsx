import { Sparkles } from "lucide-react";

export default function AITipCard() {
  return (
    <div className="p-5 rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/8 to-purple-500/8 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-200 mb-1">
            AI Tip 💡
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your <span className="text-orange-400 font-medium">Physics</span>{" "}
            score dropped 12% this week. Revise{" "}
            <span className="text-indigo-300 font-medium">Chapter 3</span>{" "}
            (Newton's Laws) before the next quiz to improve.
          </p>
        </div>
      </div>
    </div>
  );
}
