import { useState } from "react";
import { useSettings } from "../hooks/useSettings";
import toast from "react-hot-toast";

export default function ChangePasswordSection() {
  const { changePassword } = useSettings();

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const isLoading = changePassword.isPending;

  const handleUpdate = () => {
    if (!oldPass || !newPass) {
      toast.error("Please fill out both fields");
      return;
    }

    if (newPass.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    changePassword.mutate(
      { oldPassword: oldPass, newPassword: newPass },
      {
        onSuccess: () => {
          toast.success("Password updated");
          setOldPass("");
          setNewPass("");
        },
        onError: () => {
          toast.error("Incorrect password");
        },
      }
    );
  };

  return (
    <section className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-4">
      <h2 className="text-2xl font-semibold">Change Password</h2>

      <input
        type="password"
        placeholder="Current Password"
        value={oldPass}
        onChange={(e) => setOldPass(e.target.value)}
        className="w-full p-3 bg-black border border-white/20 rounded-lg focus:border-yellow-500 outline-none transition"
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
        className="w-full p-3 bg-black border border-white/20 rounded-lg focus:border-yellow-500 outline-none transition"
      />

      <button
        onClick={handleUpdate}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          isLoading
            ? "bg-gray-600 cursor-not-allowed text-gray-300"
            : "bg-yellow-500 hover:bg-yellow-600 text-black"
        }`}
      >
        {isLoading ? "Updating..." : "Update Password"}
      </button>
    </section>
  );
}
