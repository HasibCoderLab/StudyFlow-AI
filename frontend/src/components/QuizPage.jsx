import { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles,
  Timer,
  Clock,
  Brain,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Target,
  Zap,
  History as HistoryIcon,
} from "lucide-react";
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import QuestionCard from "./QuestionCard";
import Toast from "./Toast";
import { getQuestions, submitQuiz, getQuizHistory } from "../api/quiz";

const quizModes = [
  { id: "practice", label: "Practice", icon: Brain, desc: "No timer, learn at your own pace" },
  { id: "timed", label: "Timed", icon: Timer, desc: "Answer within a time limit per question" },
  { id: "mock", label: "Mock Test", icon: Trophy, desc: "Full test simulation with all questions" },
];

const subjects = ["Physics", "Chemistry", "Biology", "Math"];
const difficulties = [
  { id: "easy", label: "Easy", color: "text-green-400" },
  { id: "medium", label: "Medium", color: "text-yellow-400" },
  { id: "hard", label: "Hard", color: "text-red-400" },
];
const questionCounts = [5, 10, 15, 20];

export default function QuizPage() {
  const [view, setView] = useState("home");
  const [mode, setMode] = useState("practice");
  const [subject, setSubject] = useState("Physics");
  const [difficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    getQuizHistory(5).then((res) => setHistory(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const doSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await submitQuiz({ subject, difficulty, questions, answers });
      setScore(res.data.score);
      if (res.data.questions) setQuestions(res.data.questions);
    } catch (err) {
      setError("Failed to submit quiz.");
    } finally {
      setSubmitted(true);
      setSubmitting(false);
      setTimerActive(false);
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      setView("results");
    }
  }, [subject, difficulty, questions, answers]);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    };
  }, [timerActive]);

  useEffect(() => {
    if (timerActive && timeLeft === 0 && questions.length > 0 && !submitted) {
      doSubmit();
    }
  }, [timerActive, timeLeft, submitted, doSubmit]);

  const handleStartQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getQuestions(subject, questionCount);
      setQuestions(res.data || []);
      setAnswers({});
      setCurrentIndex(0);
      setSubmitted(false);
      setLoading(false);
      setView("taking");

      const totalQ = res.data?.length || questionCount;
      if (mode === "timed") { setTimeLeft(totalQ * 30); setTimerActive(true); }
      else if (mode === "mock") { setTimeLeft(totalQ * 45); setTimerActive(true); }
      else { setTimeLeft(null); setTimerActive(false); }
    } catch (err) {
      setError("Failed to load questions.");
      setLoading(false);
    }
  };

  const handleSelect = useCallback((qIndex, optIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  }, []);

  const handleSubmit = () => { doSubmit(); };

  const handleRetry = () => {
    setView("setup");
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setTimeLeft(null);
    setTimerActive(false);
    setError(null);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const handleNewQuiz = () => {
    setView("home");
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setTimeLeft(null);
    setTimerActive(false);
    setError(null);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const allAnswered = questions.length > 0 && questions.every((_, i) => answers[i] !== undefined);
  const percent = submitted && questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const resultPie = [
    { name: "Correct", value: score, color: "#34d399" },
    { name: "Wrong", value: questions.length - score, color: "#f87171" },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Sidebar />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-12">
          {error && <Toast message={error} type="error" onClose={() => setError(null)} />}

          {/* HOME VIEW */}
          {view === "home" && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Quiz Center</h1>
                <p className="text-sm text-gray-400 mt-1">Test your knowledge with practice quizzes, timed challenges, and mock tests</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {quizModes.map((m) => {
                  const isActive = mode === m.id;
                  return (
                    <button key={m.id} type="button" onClick={() => setMode(m.id)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                        isActive ? "bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/30" : "bg-dark-800/50 border-dark-700 hover:border-dark-500"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${isActive ? "bg-indigo-500/20" : "bg-dark-700"}`}>
                        <m.icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-gray-400"}`} />
                      </div>
                      <h3 className={`text-sm font-bold mb-0.5 ${isActive ? "text-white" : "text-gray-300"}`}>{m.label}</h3>
                      <p className="text-xs text-gray-500">{m.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
                  <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Quick Start</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Subject</label>
                      <div className="flex flex-wrap gap-1.5">
                        {subjects.map((s) => (
                          <button key={s} type="button" onClick={() => setSubject(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${
                              subject === s ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" : "bg-dark-800 text-gray-400 border-dark-600 hover:border-gray-500"
                            }`}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Questions</label>
                      <div className="flex gap-1.5">
                        {questionCounts.map((n) => (
                          <button key={n} type="button" onClick={() => setQuestionCount(n)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${
                              questionCount === n ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" : "bg-dark-800 text-gray-400 border-dark-600 hover:border-gray-500"
                            }`}>{n}</button>
                        ))}
                      </div>
                    </div>
                    <button type="button" onClick={handleStartQuiz} disabled={loading}
                      className="w-full px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-40"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4" /> Start {quizModes.find((m) => m.id === mode)?.label || "Quiz"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Quiz History */}
                <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
                  <div className="flex items-center gap-2 mb-4">
                    <HistoryIcon className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Recent Quizzes</h3>
                  </div>
                  <div className="space-y-2">
                    {history.length > 0 ? history.slice(0, 5).map((h) => {
                      const pct = h.totalQuestions > 0 ? Math.round((h.score / h.totalQuestions) * 100) : 0;
                      return (
                        <div key={h._id} className="flex items-center gap-3 p-2.5 rounded-xl bg-dark-800/50 border border-dark-700">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${pct >= 80 ? "bg-green-500/10" : pct >= 60 ? "bg-yellow-500/10" : "bg-red-500/10"}`}>
                            <Target className={`w-4 h-4 ${pct >= 80 ? "text-green-400" : pct >= 60 ? "text-yellow-400" : "text-red-400"}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-200">{h.subject}</p>
                            <p className="text-xs text-gray-500">{h.score}/{h.totalQuestions} · {h.difficulty} · {new Date(h.attemptedAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`text-sm font-bold ${pct >= 80 ? "text-green-400" : pct >= 60 ? "text-yellow-400" : "text-red-400"}`}>{pct}%</span>
                        </div>
                      );
                    }) : (
                      <p className="text-sm text-gray-500 text-center py-4">No quizzes taken yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETUP / LOADING */}
          {view === "setup" && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="flex items-center gap-3">
                <button onClick={handleNewQuiz} className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div><h2 className="text-lg font-bold text-white">Quiz Setup</h2><p className="text-xs text-gray-500">{quizModes.find((m) => m.id === mode)?.label} mode</p></div>
              </div>
              <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Subject</label>
                  <div className="flex flex-wrap gap-1.5">
                    {subjects.map((s) => (
                      <button key={s} type="button" onClick={() => setSubject(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${subject === s ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" : "bg-dark-800 text-gray-400 border-dark-600 hover:border-gray-500"}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Questions</label>
                  <div className="flex gap-1.5">
                    {questionCounts.map((n) => (
                      <button key={n} type="button" onClick={() => setQuestionCount(n)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${questionCount === n ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" : "bg-dark-800 text-gray-400 border-dark-600 hover:border-gray-500"}`}>{n}</button>
                    ))}
                  </div>
                </div>
                <button type="button" onClick={handleStartQuiz} disabled={loading}
                  className="w-full px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:opacity-40 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg> Loading questions...
                    </span>
                  ) : "Start Now"}
                </button>
              </div>
            </div>
          )}

          {/* TAKING QUIZ */}
          {view === "taking" && loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
                <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Preparing your quiz...</h3>
              <div className="w-48 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full animate-pulse" style={{ width: "50%" }} />
              </div>
            </div>
          )}

          {view === "taking" && !loading && questions.length > 0 && (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-dark-800/60 border border-dark-700">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{Object.keys(answers).length}/{questions.length} answered</span>
                  <div className="hidden sm:flex items-center gap-1">
                    {questions.map((_, i) => (
                      <button key={i} type="button" onClick={() => setCurrentIndex(i)}
                        className={`w-5 h-5 rounded text-[9px] font-bold transition-all duration-200 cursor-pointer ${
                          currentIndex === i ? "bg-indigo-500 text-white" : answers[i] !== undefined ? "bg-indigo-500/30 text-indigo-300" : "bg-dark-700 text-gray-500 hover:bg-dark-600"
                        }`}>{i + 1}</button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {timeLeft !== null && (
                    <div className={`flex items-center gap-1.5 text-sm font-bold ${timeLeft < 60 ? "text-red-400 animate-pulse" : "text-gray-300"}`}>
                      <Clock className="w-3.5 h-3.5" />{formatTime(timeLeft)}
                    </div>
                  )}
                  <button type="button" onClick={handleSubmit} disabled={!allAnswered || submitting}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all duration-200 disabled:opacity-40 cursor-pointer"
                  >{submitting ? "..." : "Submit"}</button>
                </div>
              </div>

              <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto pb-1">
                {questions.map((_, i) => (
                  <button key={i} type="button" onClick={() => setCurrentIndex(i)}
                    className={`w-7 h-7 rounded text-[10px] font-bold shrink-0 transition-all duration-200 cursor-pointer ${
                      currentIndex === i ? "bg-indigo-500 text-white" : answers[i] !== undefined ? "bg-indigo-500/30 text-indigo-300" : "bg-dark-700 text-gray-500"
                    }`}>{i + 1}</button>
                ))}
              </div>

              <div className="relative">
                <QuestionCard question={questions[currentIndex]} index={currentIndex} selected={answers[currentIndex]} onSelect={handleSelect} showResults={false} />
              </div>

              <div className="flex items-center justify-between gap-3">
                <button type="button" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-300 bg-dark-800 border border-dark-700 rounded-xl hover:bg-dark-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                ><ChevronLeft className="w-3.5 h-3.5" /> Previous</button>
                <span className="text-xs text-gray-500">{currentIndex + 1} of {questions.length}</span>
                <button type="button" onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))} disabled={currentIndex === questions.length - 1}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-300 bg-dark-800 border border-dark-700 rounded-xl hover:bg-dark-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >Next <ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}

          {/* RESULTS */}
          {view === "results" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl border border-dark-700 bg-dark-800/50 text-center animate-slide-up">
                <div className="mb-4">
                  {percent >= 60 ? (
                    <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                      <XCircle className="w-10 h-10 text-red-400" />
                    </div>
                  )}
                </div>
                <h2 className={`text-2xl font-bold mb-1 ${percent >= 80 ? "text-green-400" : percent >= 60 ? "text-yellow-400" : percent >= 40 ? "text-orange-400" : "text-red-400"}`}>
                  {percent >= 80 ? "Excellent! 🎉" : percent >= 60 ? "Good job! 👍" : percent >= 40 ? "Keep practicing! 💪" : "Need more revision 📚"}
                </h2>
                <div className="flex items-baseline justify-center gap-1.5 mt-3">
                  <span className="text-5xl font-extrabold text-white">{score}</span>
                  <span className="text-lg text-gray-400">/ {questions.length}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{percent}% correct</p>
                <div className="w-full max-w-xs mx-auto h-2.5 bg-dark-700 rounded-full overflow-hidden mt-4 mb-6">
                  <div className={`h-full rounded-full transition-all duration-700 ${percent >= 80 ? "bg-green-500" : percent >= 60 ? "bg-yellow-500" : percent >= 40 ? "bg-orange-500" : "bg-red-500"}`}
                    style={{ width: `${percent}%` }} />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button type="button" onClick={handleRetry}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl transition-all duration-200 cursor-pointer"
                  ><RotateCcw className="w-4 h-4" /> Retry Same Quiz</button>
                  <button type="button" onClick={handleNewQuiz}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-300 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-xl transition-all duration-200 cursor-pointer"
                  >New Quiz</button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/15 text-center">
                  <p className="text-2xl font-bold text-indigo-400">{score}/{questions.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Correct</p>
                </div>
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/15 text-center">
                  <p className="text-2xl font-bold text-red-400">{questions.length - score}</p>
                  <p className="text-xs text-gray-500 mt-1">Wrong</p>
                </div>
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/15 text-center">
                  <p className="text-2xl font-bold text-yellow-400">{percent}%</p>
                  <p className="text-xs text-gray-500 mt-1">Score</p>
                </div>
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/15 text-center">
                  <p className="text-2xl font-bold text-green-400">{percent >= 80 ? "A" : percent >= 60 ? "B" : percent >= 40 ? "C" : "D"}</p>
                  <p className="text-xs text-gray-500 mt-1">Grade</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
                  <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-3">Distribution</h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart><Pie data={resultPie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none">
                        {resultPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}</Pie></RePieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
                  <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-3">Performance</h3>
                  <div className="space-y-3">
                    <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Accuracy</span><span className="text-green-400 font-medium">{percent}%</span></div><div className="h-2 bg-dark-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-green-500 rounded-full" style={{ width: `${percent}%` }} /></div></div>
                    <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Subject</span><span className="text-gray-200 font-medium">{subject}</span></div></div>
                    <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Mode</span><span className="text-indigo-400 font-medium capitalize">{mode}</span></div></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Review Answers</h3>
                {questions.map((q, i) => (
                  <QuestionCard key={i} question={q} index={i} selected={answers[i]} showResults={true} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
