import { useTheme } from "../context/ThemeContext";
import { useSettings } from "../hooks/useSettings";
import toast from "react-hot-toast";

export default function ThemeToggleSection() {
  const { updateTheme } = useSettings();
  const { theme, setTheme } = useTheme();

  const isLoading = updateTheme.isPending;

  const handleToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    updateTheme.mutate(
      { theme: newTheme },
      {
        onSuccess: () => {
          setTheme(newTheme);
          toast.success(`Switched to ${newTheme} mode`);
        },
        onError: () => {
          toast.error("Failed to update theme");
        },
      }
    );
  };

  return (
    <section className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-4">
      <h2 className="text-2xl font-semibold">Theme</h2>

      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          isLoading
            ? "bg-gray-600 cursor-not-allowed text-gray-300"
            : "bg-yellow-500 hover:bg-yellow-600 text-black"
        }`}
      >
        {isLoading
          ? "Updating..."
          : `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
      </button>
    </section>
  );
}
