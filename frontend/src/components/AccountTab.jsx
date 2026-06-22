import { useState } from "react";
import { Key, Globe, Calendar } from "lucide-react";
import Toast from "./Toast";

export default function AccountTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState(null);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setToast("Passwords do not match");
      return;
    }
    setToast("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Account</h2>
        <p className="text-sm text-gray-400 mt-1">Manage your account security and connections</p>
      </div>

      {/* Change Password */}
      <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Change Password</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleChangePassword}
            disabled={!currentPassword || !newPassword || !confirmPassword}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="p-5 rounded-2xl border border-dark-700 bg-dark-800/50">
        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Connected Accounts</h3>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-800 border border-dark-700">
          <div className="w-9 h-9 rounded-lg bg-dark-700 flex items-center justify-center">
            <Globe className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-200">Google</p>
            <p className="text-xs text-gray-500">alex@gmail.com</p>
          </div>
          <span className="text-xs text-green-400 font-medium bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
            Connected
          </span>
        </div>
      </div>

      {/* Member Since */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-800/50 border border-dark-700">
        <Calendar className="w-5 h-5 text-indigo-400" />
        <div>
          <p className="text-sm text-gray-200">Member since <span className="font-semibold text-white">March 2026</span></p>
          <p className="text-xs text-gray-500">Joined StudyFlow AI</p>
        </div>
      </div>

      {toast && <Toast message={toast} type={toast === "Passwords do not match" ? "error" : "success"} onClose={() => setToast(null)} />}
    </div>
  );
}
