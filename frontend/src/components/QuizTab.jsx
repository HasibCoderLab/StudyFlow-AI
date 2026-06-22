import { useState } from "react";
import { Sparkles } from "lucide-react";
import QuizForm from "./QuizForm";
import QuestionCard from "./QuestionCard";
import QuizResultCard from "./QuizResultCard";
import Toast from "./Toast";
import { getQuestions, submitQuiz } from "../api/quiz";

export default function QuizTab() {
  const [formData, setFormData] = useState({
    subject: "Physics",
    topic: "",
    count: 5,
    difficulty: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setAnswers({});
    setSubmitted(false);
    try {
      const res = await getQuestions(formData.subject, formData.count);
      setQuestions(res.data || []);
    } catch (err) {
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIndex, optIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = async () => {
    setSubmittingQuiz(true);
    try {
      const res = await submitQuiz({
        subject: formData.subject,
        topic: formData.topic,
        difficulty: formData.difficulty,
        questions,
        answers,
      });
      setScore(res.data.score);
      setSubmitted(true);
      // Update questions with results
      if (res.data.questions) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      setError("Failed to submit quiz.");
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleRetry = () => {
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setError(null);
  };

  const allAnswered = questions.length > 0 && questions.every((_, i) => answers[i] !== undefined);

  return (
    <div className="space-y-6">
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}

      {questions.length === 0 && !loading && (
        <QuizForm
          formData={formData}
          setFormData={setFormData}
          onGenerate={handleGenerate}
          loading={loading}
        />
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <h3 className="text-base font-semibold text-gray-200 mb-2">Generating your quiz...</h3>
          <div className="w-40 h-1.5 bg-dark-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full animate-pulse" style={{ width: "50%" }} />
          </div>
        </div>
      )}

      {questions.length > 0 && !loading && !submitted && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
              Quiz — {questions.length} Questions
            </h3>
            <span className="text-xs text-gray-500">
              {Object.keys(answers).length}/{questions.length} answered
            </span>
          </div>

          <div className="space-y-3">
            {questions.map((q, i) => (
              <QuestionCard
                key={i}
                question={q}
                index={i}
                selected={answers[i]}
                onSelect={handleSelect}
                showResults={false}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered || submittingQuiz}
            className="w-full px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {submittingQuiz ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </span>
            ) : allAnswered ? (
              "Submit Quiz"
            ) : (
              `Answer all questions (${Object.keys(answers).length}/${questions.length})`
            )}
          </button>
        </div>
      )}

      {submitted && !loading && (
        <div className="space-y-4">
          <QuizResultCard score={score} total={questions.length} onRetry={handleRetry} />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Review Answers</h3>
            {questions.map((q, i) => (
              <QuestionCard key={i} question={q} index={i} selected={answers[i]} showResults={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
