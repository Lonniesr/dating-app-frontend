import useInstallPrompt from "../hooks/useInstallPrompt";

interface Props {
  className?: string;
}

export default function InstallPrompt({
  className = "",
}: Props) {
  const {
    canInstall,
    install,
    dismiss,
    dismissed,
    isIOS,
    isInstalled,
  } = useInstallPrompt();

  // Already installed
  if (isInstalled) return null;

  // User chose "Maybe later"
  if (dismissed) return null;

  // Browser doesn't support install
  if (!canInstall && !isIOS) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6 ${className}`}
    >
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 text-center">

          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
            <img
              src="/icons/icon-192.png"
              alt="LynQ"
              className="h-16 w-16"
            />
          </div>

          <h2 className="text-3xl font-bold text-white">
            Install LynQ
          </h2>

          <p className="mt-3 text-slate-300">
            Install LynQ for the best dating experience.
          </p>

        </div>

        {/* Benefits */}
        <div className="px-8 mt-8 space-y-4">

          <Feature text="Opens like a native app" />

          <Feature text="Faster loading" />

          <Feature text="Instant push notifications" />

          <Feature text="Always up to date" />

        </div>

        {/* iPhone */}
        {isIOS ? (
          <div className="px-8 mt-8">

            <div className="rounded-2xl bg-slate-800 p-5 text-sm text-slate-300 leading-7">

              <p className="font-semibold text-white mb-3">
                Install on iPhone
              </p>

              <ol className="list-decimal pl-5 space-y-2">
                <li>Tap the Share button.</li>
                <li>Select <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong>.</li>
              </ol>

            </div>

          </div>
        ) : (
          <div className="px-8 mt-8">

            <button
              onClick={install}
              className="w-full rounded-xl bg-pink-600 hover:bg-pink-500 transition text-white font-semibold py-4"
            >
              Install LynQ
            </button>

          </div>
        )}

        {/* Footer */}
        <div className="px-8 py-6">

          <button
            onClick={dismiss}
            className="w-full rounded-xl border border-slate-700 py-3 text-slate-300 hover:bg-slate-800 transition"
          >
            Maybe Later
          </button>

        </div>

      </div>
    </div>
  );
}

function Feature({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-slate-200">

      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-black text-xs font-bold">
        ✓
      </div>

      <span>{text}</span>

    </div>
  );
}