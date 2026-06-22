import { useState } from "react";
import { AlertTriangle, Download, X } from "lucide-react";
import Toast from "./Toast";

export default function DangerZoneTab() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [toast, setToast] = useState(null);

  const handleExport = () => {
    setToast("Your data export has been initiated. Check your email.");
  };

  const canDelete = confirmText === "DELETE";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Danger Zone</h2>
        <p className="text-sm text-gray-400 mt-1">Irreversible actions for your account</p>
      </div>

      {/* Export Data */}
      <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
        <h3 className="text-sm font-semibold text-gray-200 mb-1">Export Your Data</h3>
        <p className="text-xs text-gray-500 mb-4">
          Download a copy of all your study data, progress, and settings.
        </p>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-300 bg-dark-800 border border-dark-600 hover:bg-dark-700 hover:border-gray-500 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export My Data
        </button>
      </div>

      {/* Delete Account */}
      <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-300 mb-1">Delete Account</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Permanently delete your account and all associated data. This action cannot be undone. All your study progress, quiz results, and personal information will be removed.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all duration-200 shadow-md shadow-red-500/20 cursor-pointer"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-dark-800 border border-dark-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Your Account</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              This action is permanent and cannot be undone. All your data — study plans, quiz results, progress, and settings — will be permanently deleted.
            </p>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type <span className="font-bold text-red-400">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE here..."
              className="w-full px-4 py-2.5 bg-dark-800 border border-red-500/30 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-red-500/40 focus:border-red-500/50 mb-4"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                }}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-300 bg-dark-800 border border-dark-600 hover:bg-dark-700 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!canDelete}
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                  setToast("Account deletion requested. Check your email to confirm.");
                }}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
