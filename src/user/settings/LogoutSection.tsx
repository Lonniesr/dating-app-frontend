import { useSettings } from "../hooks/useSettings";
import toast from "react-hot-toast";

export default function LogoutSection() {
  const { logout } = useSettings();
  const isLoading = logout.isPending;

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out");

        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      },
      onError: () => {
        toast.error("Failed to logout");
      },
    });
  };

  return (
    <section className="bg-[#111] p-6 rounded-2xl border border-white/10">
      <h2 className="text-2xl font-semibold mb-4">Logout</h2>

      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          isLoading
            ? "bg-gray-600 cursor-not-allowed text-gray-300"
            : "bg-white/10 hover:bg-white/20 text-white"
        }`}
      >
        {isLoading ? "Logging out..." : "Logout"}
      </button>
    </section>
  );
}
