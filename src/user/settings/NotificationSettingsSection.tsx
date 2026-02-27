import { useState } from "react";
import { useSettings } from "../hooks/useSettings";
import toast from "react-hot-toast";

export default function NotificationSettingsSection() {
  const { updateNotifications } = useSettings();

  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);

  const isLoading = updateNotifications.isPending;

  const handleSave = () => {
    updateNotifications.mutate(
      { push, email },
      {
        onSuccess: () => {
          toast.success("Notification settings saved");
        },
        onError: () => {
          toast.error("Failed to save notification settings");
        },
      }
    );
  };

  return (
    <section className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-4">
      <h2 className="text-2xl font-semibold">Notifications</h2>

      <div className="space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-300">Push Notifications</span>
          <input
            type="checkbox"
            checked={push}
            onChange={() => setPush(!push)}
            className="h-5 w-5 accent-yellow-500"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-300">Email Notifications</span>
          <input
            type="checkbox"
            checked={email}
            onChange={() => setEmail(!email)}
            className="h-5 w-5 accent-yellow-500"
          />
        </label>
      </div>

      <button
        onClick={handleSave}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          isLoading
            ? "bg-gray-600 cursor-not-allowed text-gray-300"
            : "bg-yellow-500 hover:bg-yellow-600 text-black"
        }`}
      >
        {isLoading ? "Saving..." : "Save Notification Settings"}
      </button>
    </section>
  );
}
