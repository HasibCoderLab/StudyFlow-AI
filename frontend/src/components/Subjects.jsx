import { useState, useEffect } from "react";
import { Plus, BookOpen } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import SubjectCard from "./SubjectCard";
import AddSubjectModal from "./AddSubjectModal";
import ChapterDrawer from "./ChapterDrawer";
import { getSubjects, createSubject } from "../api/subjects";
import { getChaptersBySubject } from "../api/chapters";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [drawerSubject, setDrawerSubject] = useState(null);
  const [drawerChapters, setDrawerChapters] = useState([]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await getSubjects();
      setSubjects(res.data || []);
    } catch (err) {
      setError("Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async (newSubject) => {
    try {
      const res = await createSubject(newSubject);
      setSubjects((prev) => [...prev, res.data]);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create subject:", err);
    }
  };

  const handleOpenDrawer = async (subject) => {
    setDrawerSubject(subject);
    try {
      const res = await getChaptersBySubject(subject._id);
      // Merge chapters into subject object
      setDrawerChapters(res.data || []);
    } catch (err) {
      setDrawerChapters([]);
    }
  };

  const handleUpdateSubjectInDrawer = (updatedChapters) => {
    setDrawerChapters(updatedChapters);
    // Also update the subject in the subjects list
    setSubjects((prev) =>
      prev.map((s) =>
        s._id === drawerSubject?._id ? { ...s, chapters: updatedChapters } : s
      )
    );
  };

  // Build local subject objects with chapters for the drawer
  const subjectsWithChapters = subjects.map((s) => ({
    ...s,
    id: s._id,
    _id: s._id,
    chapters: s._id === drawerSubject?._id ? drawerChapters : [],
  }));

  const totalChapters = subjects.reduce((sum, s) => sum + (s.totalChapters || 0), 0);

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Sidebar />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Topbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">My Subjects</h1>
              <p className="text-sm text-gray-400 mt-1">
                {subjects.length} subjects · {totalChapters} chapters
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-200 shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Subject
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-dark-800/50 border border-dark-700 p-5 animate-pulse">
                  <div className="h-5 w-2/3 bg-dark-600 rounded mb-3" />
                  <div className="h-10 w-10 bg-dark-600 rounded-full mb-3" />
                  <div className="h-3 w-full bg-dark-600 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-red-400 mb-2">{error}</p>
              <button onClick={fetchSubjects} className="text-indigo-400 text-sm hover:text-indigo-300 cursor-pointer">
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && subjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No subjects yet</h3>
              <p className="text-sm text-gray-500 max-w-md mb-6">
                Add your first subject and start tracking your chapter progress.
              </p>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Your First Subject
              </button>
            </div>
          )}

          {/* Subject Cards Grid */}
          {!loading && !error && subjects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {subjectsWithChapters.map((subject) => (
                <SubjectCard
                  key={subject._id}
                  subject={subject}
                  onClick={() => handleOpenDrawer(subject)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Subject Modal */}
      {showModal && (
        <AddSubjectModal
          onClose={() => setShowModal(false)}
          onSave={handleAddSubject}
        />
      )}

      {/* Chapter Drawer */}
      {drawerSubject && (
        <ChapterDrawer
          subject={{
            ...drawerSubject,
            id: drawerSubject._id,
            chapters: drawerChapters,
          }}
          onClose={() => {
            setDrawerSubject(null);
            setDrawerChapters([]);
          }}
          onUpdateSubject={(updated) => {
            handleUpdateSubjectInDrawer(updated.chapters || drawerChapters);
          }}
        />
      )}
    </div>
  );
}
