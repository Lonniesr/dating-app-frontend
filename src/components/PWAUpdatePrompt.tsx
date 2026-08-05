import usePWAUpdate from "../hooks/usePWAUpdate";

export default function PWAUpdatePrompt() {
  const {
    updateAvailable,
    updateApp,
  } = usePWAUpdate();

  if (!updateAvailable) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">

        <div className="px-8 pt-8 text-center">

          <img
            src="/icons/icon-192.png"
            alt="LynQ"
            className="mx-auto h-20 w-20 mb-6"
          />

          <h2 className="text-3xl font-bold text-white">
            Update Available
          </h2>

          <p className="mt-4 text-slate-300">
            A new version of LynQ is ready.
          </p>

          <p className="mt-1 text-slate-400 text-sm">
            Update now to enjoy the latest improvements.
          </p>

        </div>

        <div className="px-8 py-8 space-y-4">

          <button
            onClick={updateApp}
            className="w-full rounded-xl bg-yellow-500 py-4 font-semibold text-black transition hover:bg-yellow-400"
          >
            Update Now
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-xl border border-slate-700 py-4 text-slate-300 transition hover:bg-slate-800"
          >
            Later
          </button>

        </div>

      </div>
    </div>
  );
}