import { useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
import Toast from "./Toast";
import { getMe } from "../api/auth";
import { updateProfile } from "../api/users";

export default function ProfileTab() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [examDate, setExamDate] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getMe()
      .then((res) => {
        const u = res.data;
        setName(u.name || "");
        setEmail(u.email || "");
        setClassLevel(u.classLevel || "");
        setGoal(u.goal || "");
        setSubjects(u.subjects || []);
        setExamDate(u.examDate ? u.examDate.split("T")[0] : "");
      })
      .catch(() => setToast("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const classOptions = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "SSC", "HSC", "University", "Skill Learner"];
  const goalOptions = ["Engineering Admission", "Medical Admission", "University Exam", "Skill Building", "Other"];

  const handleAddSubject = (e) => {
    if (e.key === "Enter" && subjectInput.trim()) {
      e.preventDefault();
      if (!subjects.includes(subjectInput.trim())) {
        setSubjects((prev) => [...prev, subjectInput.trim()]);
      }
      setSubjectInput("");
    }
  };

  const handleRemoveSubject = (s) => {
    setSubjects((prev) => prev.filter((sub) => sub !== s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, classLevel, goal, subjects, examDate: examDate || null });
      setToast("Profile updated");
    } catch (err) {
      setToast("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-5 w-24 bg-dark-600 rounded" />
        <div className="flex items-center gap-5"><div className="w-20 h-20 rounded-full bg-dark-600" /><div className="h-4 w-32 bg-dark-600 rounded" /></div>
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 w-full bg-dark-600 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Profile</h2>
        <p className="text-sm text-gray-400 mt-1">Manage your personal information</p>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-indigo-500/20">
            {(name || "U")[0].toUpperCase()}
          </div>
          <button type="button" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-all cursor-pointer">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-200">{name}</p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
      </div>

      {/* Exam Date */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Exam Date <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-white outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 [color-scheme:dark]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
          <input type="email" value={email} readOnly
            className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-gray-400 outline-none cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Class / Level</label>
          <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)}
            className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-white outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%236b7280' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
          >
            {classOptions.map((opt) => (<option key={opt} value={opt} className="bg-dark-800 text-white">{opt}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Goal</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)}
            className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-white outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%236b7280' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
          >
            {goalOptions.map((opt) => (<option key={opt} value={opt} className="bg-dark-800 text-white">{opt}</option>))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Subjects</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {subjects.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
              {s}
              <button type="button" onClick={() => handleRemoveSubject(s)} className="hover:text-white transition-colors cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <input type="text" value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} onKeyDown={handleAddSubject}
          placeholder="Type a subject and press Enter..."
          className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50" />
      </div>

      <button type="button" onClick={handleSave} disabled={saving}
        className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-200 shadow-md shadow-indigo-500/20 disabled:opacity-40 cursor-pointer"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
