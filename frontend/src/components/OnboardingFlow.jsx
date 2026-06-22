import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "./Toast";

/* ─── Progress Dots ─── */
function ProgressDots({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={i} className="flex items-center">
            {/* Dot */}
            <div
              className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-110"
                  : isCompleted
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40"
                    : "bg-white/5 text-gray-500 border border-gray-700/50"
              }`}
            >
              {isCompleted ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                stepNum
              )}
            </div>
            {/* Connector line (except after last) */}
            {i < totalSteps - 1 && (
              <div
                className={`w-12 sm:w-20 h-0.5 mx-1 transition-all duration-500 ${
                  stepNum <= currentStep ? "bg-indigo-500/60" : "bg-gray-700/30"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Step Label ─── */
function StepLabel({ currentStep }) {
  const labels = ["Basic Info", "Subjects", "Your Goal", "Review"];
  return (
    <p className="text-center text-sm text-gray-400 mb-6">
      Step {currentStep} of 4 — <span className="text-indigo-400 font-medium">{labels[currentStep - 1]}</span>
    </p>
  );
}

/* ─── Step 1: Basic Info ─── */
function StepBasicInfo({ data, onChange }) {
  const [touched, setTouched] = useState({ name: false, classLevel: false });

  const classes = [
    { value: "", label: "Select your class / level" },
    { value: "class-6", label: "Class 6" },
    { value: "class-7", label: "Class 7" },
    { value: "class-8", label: "Class 8" },
    { value: "class-9", label: "Class 9" },
    { value: "class-10", label: "Class 10 — SSC" },
    { value: "hsc", label: "HSC (Class 11-12)" },
    { value: "university", label: "University" },
    { value: "skill-learner", label: "Skill Learner" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          What's your name?
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          placeholder="Enter your full name"
          className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 ${
            touched.name && !data.name.trim()
              ? "border-red-500/50"
              : "border-gray-700/50 focus:border-indigo-500/50"
          }`}
        />
        {touched.name && !data.name.trim() && (
          <p className="text-xs text-red-400 mt-1.5">Please enter your name</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          What's your class / level?
        </label>
        <select
          value={data.classLevel}
          onChange={(e) => {
            onChange("classLevel", e.target.value);
            setTouched((t) => ({ ...t, classLevel: true }));
          }}
          onBlur={() => setTouched((t) => ({ ...t, classLevel: true }))}
          className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white outline-none appearance-none cursor-pointer transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 ${
            touched.classLevel && !data.classLevel
              ? "border-red-500/50"
              : "border-gray-700/50 focus:border-indigo-500/50"
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 0.75rem center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1.25rem",
          }}
        >
          {classes.map((c) => (
            <option key={c.value} value={c.value} disabled={!c.value} className="bg-gray-900 text-gray-300">
              {c.label}
            </option>
          ))}
        </select>
        {touched.classLevel && !data.classLevel && (
          <p className="text-xs text-red-400 mt-1.5">Please select your class</p>
        )}
      </div>
    </div>
  );
}

/* ─── Step 2: Subjects ─── */
const quickSuggestions = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT",
  "English",
  "Bangla",
  "History",
  "Geography",
  "Economics",
];

function StepSubjects({ data, onChange }) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const addSubject = (subj) => {
    const trimmed = subj.trim();
    if (trimmed && !data.subjects.includes(trimmed)) {
      onChange("subjects", [...data.subjects, trimmed]);
    }
    setInputValue("");
    inputRef.current?.focus();
  };

  const removeSubject = (subj) => {
    onChange(
      "subjects",
      data.subjects.filter((s) => s !== subj)
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubject(inputValue);
    }
  };

  const suggestionsToShow = quickSuggestions.filter(
    (s) => !data.subjects.includes(s)
  );

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Add your subjects
        </label>
        <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-gray-700/50 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500/50 transition-all duration-200">
          {data.subjects.map((subj) => (
            <span
              key={subj}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm font-medium group"
            >
              {subj}
              <button
                onClick={() => removeSubject(subj)}
                className="text-indigo-400 hover:text-indigo-200 transition-colors"
                aria-label={`Remove ${subj}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={data.subjects.length === 0 ? "Type a subject and press Enter..." : "Add more..."}
            className="flex-1 min-w-[120px] bg-transparent text-white placeholder-gray-500 outline-none text-sm"
          />
        </div>
        {data.subjects.length === 0 && (
          <p className="text-xs text-gray-500 mt-2">Add at least 1 subject to continue</p>
        )}
      </div>

      {/* Quick-add suggestion buttons */}
      {suggestionsToShow.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
            Quick add
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestionsToShow.slice(0, 6).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSubject(s)}
                className="px-3 py-1.5 text-sm text-gray-400 bg-white/5 hover:bg-indigo-500/15 hover:text-indigo-300 border border-gray-700/40 hover:border-indigo-500/30 rounded-lg transition-all duration-200 cursor-pointer"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Step 3: Goal ─── */
const goalOptions = [
  {
    id: "engineering",
    label: "Engineering Admission",
    description: "BUET, KUET, RUET, CUET & other engineering universities",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: "medical",
    label: "Medical Admission",
    description: "MBBS, Dental & other medical college admissions",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: "university-exam",
    label: "University Exam",
    description: "Semester finals, midterms & internal assessments",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: "skill-building",
    label: "Skill Building",
    description: "Learning new skills, certifications & self-improvement",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "other",
    label: "Other",
    description: "Something else — tell us more",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
      </svg>
    ),
  },
];

function StepGoal({ data, onChange }) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-300 mb-1">What's your goal?</p>
      {goalOptions.map((opt) => {
        const selected = data.goal === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange("goal", opt.id)}
            className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
              selected
                ? "bg-indigo-500/10 border-indigo-500/50 shadow-md shadow-indigo-500/10"
                : "bg-white/5 border-gray-700/50 hover:border-gray-600/50 hover:bg-white/[0.07]"
            }`}
          >
            <div
              className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                selected
                  ? "bg-indigo-600 text-white"
                  : "bg-white/10 text-gray-400"
              }`}
            >
              {opt.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p
                  className={`text-sm font-semibold ${
                    selected ? "text-indigo-300" : "text-gray-200"
                  }`}
                >
                  {opt.label}
                </p>
                {selected && (
                  <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
            </div>
          </button>
        );
      })}

      {data.goal === "other" && (
        <div className="animate-slide-up overflow-hidden transition-all duration-300">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Tell us your goal
          </label>
          <input
            type="text"
            value={data.customGoal}
            onChange={(e) => onChange("customGoal", e.target.value)}
            placeholder="e.g. Prepare for job interview"
            className="w-full px-4 py-3 bg-white/5 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50"
          />
        </div>
      )}
    </div>
  );
}

/* ─── Step 4: Exam Date + Summary ─── */
function formatDate(dateStr) {
  if (!dateStr) return "Not set";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getClassLabel(val) {
  const map = {
    "class-6": "Class 6",
    "class-7": "Class 7",
    "class-8": "Class 8",
    "class-9": "Class 9",
    "class-10": "Class 10 — SSC",
    hsc: "HSC (Class 11-12)",
    university: "University",
    "skill-learner": "Skill Learner",
  };
  return map[val] || val;
}

function getGoalLabel(val) {
  const map = {
    engineering: "Engineering Admission",
    medical: "Medical Admission",
    "university-exam": "University Exam",
    "skill-building": "Skill Building",
    other: "Other",
  };
  return map[val] || val;
}

function StepReview({ data, onChange, onSubmit, submitting }) {
  return (
    <div className="space-y-6">
      {/* Optional date picker */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">
            When's your exam? <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          {data.examDate && (
            <button
              type="button"
              onClick={() => onChange("examDate", "")}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <input
          type="date"
          value={data.examDate}
          onChange={(e) => onChange("examDate", e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-gray-700/50 rounded-xl text-white outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 [color-scheme:dark]"
        />
        {!data.examDate && (
          <p className="text-xs text-gray-500 mt-1.5">
            Not sure? You can skip and set it later.
          </p>
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
          Your Profile Summary
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Name</span>
            <span className="text-white font-medium">{data.name}</span>
          </div>
          <div className="h-px bg-indigo-500/10" />

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Class / Level</span>
            <span className="text-white font-medium">{getClassLabel(data.classLevel)}</span>
          </div>
          <div className="h-px bg-indigo-500/10" />

          <div className="flex justify-between items-start">
            <span className="text-gray-400">Subjects</span>
            <div className="flex flex-wrap gap-1.5 justify-end max-w-[60%]">
              {data.subjects.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-0.5 bg-indigo-500/15 text-indigo-300 rounded-md text-xs font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="h-px bg-indigo-500/10" />

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Goal</span>
            <span className="text-white font-medium">
              {data.goal === "other" && data.customGoal
                ? data.customGoal
                : getGoalLabel(data.goal)}
            </span>
          </div>
          <div className="h-px bg-indigo-500/10" />

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Exam Date</span>
            <span className={`font-medium ${data.examDate ? "text-white" : "text-gray-500"}`}>
              {data.examDate ? formatDate(data.examDate) : "Not set"}
            </span>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="w-full px-6 py-4 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:scale-100 animate-pulse-glow"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating your study plan...
          </span>
        ) : (
          "Create My Study Plan"
        )}
      </button>

      <p className="text-xs text-gray-600 text-center">
        You'll be redirected to your personalized dashboard
      </p>
    </div>
  );
}

/* ─── Success State ─── */
function SuccessState({ data }) {
  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-indigo-500 to-indigo-400 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Study Plan Created! 🎉</h2>
      <p className="text-sm text-gray-400 mb-6">Redirecting to your dashboard...</p>
      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full animate-pulse" style={{ width: "100%" }} />
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Welcome, {data.name}! Your personalized AI study coach is ready.
      </p>
    </div>
  );
}

/* ─── Main Onboarding Flow ─── */
export default function OnboardingFlow() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [direction, setDirection] = useState("next");
  const [data, setData] = useState({
    name: "",
    classLevel: "",
    subjects: [],
    goal: "",
    customGoal: "",
    examDate: "",
  });

  // Generate a temporary email and password for first-time users
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const updateData = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const canGoNext = () => {
    switch (step) {
      case 1: {
        const isNameValid = data.name.trim().length > 0;
        const isClassValid = data.classLevel !== "";
        const isEmailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPasswordValid = !password || password.length >= 6;
        return isNameValid && isClassValid && isEmailValid && isPasswordValid;
      }
      case 2:
        return data.subjects.length > 0;
      case 3:
        return data.goal !== "" && (data.goal !== "other" || data.customGoal.trim().length > 0);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setDirection("next");
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection("prev");
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    // Generate unique email based on clean name & random suffix if not provided
    const cleanName = data.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ".")
      .replace(/[^a-z0-9.]/g, "")
      .replace(/\.+/g, ".");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const userEmail = email.trim() || `${cleanName}${randomSuffix}@studyflow.ai`;
    const userPassword = password || "password123";

    const payload = {
      name: data.name,
      email: userEmail,
      password: userPassword,
      classLevel: data.classLevel,
      goal: data.goal === "other" && data.customGoal ? data.customGoal : data.goal,
      subjects: data.subjects,
      examDate: data.examDate || null,
    };

    try {
      await register(payload);
      setSubmitting(false);
      setDone(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gradient-to-br from-[#12122a] to-[#0d0d22] rounded-3xl border border-[#1e1e3a] shadow-2xl p-8">
          <SuccessState data={data} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Card */}
        <div className="bg-gradient-to-br from-[#12122a] to-[#0d0d22] rounded-3xl border border-[#1e1e3a] shadow-2xl shadow-indigo-500/5 p-6 sm:p-8">
          {/* Progress */}
          <ProgressDots currentStep={step} totalSteps={4} />
          <StepLabel currentStep={step} />

          {/* Step content with fade/slide */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              direction === "next" ? "animate-slide-in-right" : "animate-slide-in-left"
            }`}
          >
            {/* Registration fields — shown on step 1 */}
          {step === 1 && (
            <>
              <StepBasicInfo data={data} onChange={updateData} />
              <div className="mt-5 pt-5 border-t border-gray-700/30 space-y-4">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Account Details</p>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email <span className="text-gray-500">(optional)</span></label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 ${
                      email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                        ? "border-red-500/50 focus:border-red-500/50"
                        : "border-gray-700/50 focus:border-indigo-500/50"
                    }`}
                  />
                  {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                    <p className="text-xs text-red-400 mt-1.5">Please enter a valid email address</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password <span className="text-gray-500">(min 6 chars)</span></label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a password"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 ${
                      password && password.length < 6
                        ? "border-red-500/50 focus:border-red-500/50"
                        : "border-gray-700/50 focus:border-indigo-500/50"
                    }`}
                  />
                  {password && password.length < 6 && (
                    <p className="text-xs text-red-400 mt-1.5">Password must be at least 6 characters</p>
                  )}
                </div>
              </div>
            </>
          )}
            {step === 2 && <StepSubjects data={data} onChange={updateData} />}
            {step === 3 && <StepGoal data={data} onChange={updateData} />}
            {step === 4 && (
              <StepReview
                data={data}
                onChange={updateData}
                onSubmit={handleSubmit}
                submitting={submitting}
              />
            )}
          </div>

          {/* Navigation buttons (not on step 4 — it has its own submit) */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#1e1e3a]">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:text-gray-400"
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext()}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-200 shadow-md shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:hover:shadow-md"
              >
                <span className="flex items-center gap-1.5">
                  {step === 4 ? "Create Plan" : "Continue"}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}
