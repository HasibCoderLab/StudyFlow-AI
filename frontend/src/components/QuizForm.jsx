export default function QuizForm({ formData, setFormData, onGenerate, loading }) {
  const subjects = ["Physics", "Chemistry", "Biology", "Math"];
  const questionCounts = [3, 5, 10];
  const difficulties = [
    { id: "easy", label: "Easy", color: "text-green-400" },
    { id: "medium", label: "Medium", color: "text-yellow-400" },
    { id: "hard", label: "Hard", color: "text-red-400" },
  ];

  const canGenerate = formData.subject && formData.topic.trim();

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-dark-700 bg-dark-800/50">
      <h3 className="text-lg font-bold text-white mb-1">Generate a Quiz</h3>
      <p className="text-sm text-gray-400 mb-5">
        Test your knowledge with AI-generated questions on any topic.
      </p>

      <div className="space-y-5">
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
          <div className="flex flex-wrap gap-2">
            {subjects.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, subject: s }))}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer ${
                  formData.subject === s
                    ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                    : "bg-dark-800 text-gray-400 border-dark-600 hover:border-gray-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Topic/Tag */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Chapter / Topic
          </label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))}
            placeholder="e.g. Newton's Laws, Quadratic Equations"
            className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50"
          />
        </div>

        {/* Number of questions */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Questions
          </label>
          <div className="flex gap-2">
            {questionCounts.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, count: n }))}
                className={`px-5 py-2 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer ${
                  formData.count === n
                    ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                    : "bg-dark-800 text-gray-400 border-dark-600 hover:border-gray-500"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Difficulty
          </label>
          <div className="flex gap-2">
            {difficulties.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, difficulty: d.id }))}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer ${
                  formData.difficulty === d.id
                    ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                    : "bg-dark-800 text-gray-400 border-dark-600 hover:border-gray-500"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate || loading}
          className="w-full px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating your quiz...
            </span>
          ) : (
            "Generate Quiz"
          )}
        </button>
      </div>
    </div>
  );
}
