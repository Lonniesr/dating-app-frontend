import { useSettings } from "../hooks/useSettings";
import toast from "react-hot-toast";

export default function DeleteAccountSection() {
  const { deleteAccount } = useSettings();
  const isLoading = deleteAccount.isPending;

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        toast.success("Account deleted");

        setTimeout(() => {
          window.location.href = "/signup";
        }, 600);
      },
      onError: () => {
        toast.error("Failed to delete account");
      },
    });
  };

  return (
    <section className="bg-[#111] p-6 rounded-2xl border border-red-500/30 space-y-4">
      <h2 className="text-2xl font-semibold text-red-400">Danger Zone</h2>

      <p className="text-gray-400 text-sm leading-relaxed">
        Deleting your account is permanent. All your matches, messages, and data will be removed.
      </p>

      <button
        onClick={handleDelete}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          isLoading
            ? "bg-red-900 cursor-not-allowed text-red-300"
            : "bg-red-600 hover:bg-red-700 text-white"
        }`}
      >
        {isLoading ? "Deleting..." : "Delete Account"}
      </button>
    </section>
  );
}
