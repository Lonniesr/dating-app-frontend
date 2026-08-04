import { useNavigate } from "react-router-dom";
import useInstallPrompt from "../../../hooks/useInstallPrompt";
import { useEffect } from "react";

export default function InstallStep() {
  const navigate = useNavigate();

  const {
    canInstall,
    install,
    dismiss,
    isIOS,
    isInstalled,
  } = useInstallPrompt();

  useEffect(() => {
  // Already installed? Continue immediately.
  if (isInstalled) {
    finishOnboarding();
    return;
  }

  // User previously dismissed install and
  // there is no install prompt available.
  const dismissed =
    localStorage.getItem("lynq-install-dismissed") === "true";

  if (dismissed && !canInstall && !isIOS) {
    finishOnboarding();
  }
}, [isInstalled, canInstall, isIOS]);

  function finishOnboarding() {
    dismiss();

    const inviteData = JSON.parse(
      localStorage.getItem("lynqInviteData") || "{}"
    );

    if (
      inviteData.redirectToInviter &&
      inviteData.invitedById
    ) {
      localStorage.removeItem("lynqInviteData");

      navigate(
        `/user/profile/${inviteData.invitedById}`
      );

      return;
    }

    navigate("/user/dashboard");
  }

  return (
    <div className="max-w-lg mx-auto text-center">

      <div className="mb-8">

        <img
          src="/icons/icon-192.png"
          alt="LynQ"
          className="w-28 h-28 mx-auto mb-6"
        />

        <h1 className="text-4xl font-bold text-white mb-4">
          Install LynQ
        </h1>

        <p className="text-white/70 text-lg">
          Install LynQ for the best experience.
        </p>

      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">

        <Feature>Opens like a native app</Feature>
        <Feature>Instant push notifications</Feature>
        <Feature>Faster loading</Feature>
        <Feature>Always up to date</Feature>

      </div>

      {isInstalled ? (
        <button
          onClick={finishOnboarding}
          className="w-full py-4 rounded-xl bg-yellow-500 text-black font-semibold"
        >
          Continue
        </button>
      ) : isIOS ? (
        <>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-6 text-left">

            <h2 className="text-xl font-semibold mb-4">
              Install on iPhone
            </h2>

            <ol className="list-decimal pl-6 space-y-2 text-white/80">
              <li>Tap the Share button.</li>
              <li>Select <strong>Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong>.</li>
            </ol>

          </div>

          <button
            onClick={finishOnboarding}
            className="w-full py-4 rounded-xl bg-yellow-500 text-black font-semibold"
          >
            Continue
          </button>
        </>
      ) : (
        <>
          {canInstall && (
            <button
              onClick={async () => {
                await install();
                finishOnboarding();
              }}
              className="w-full py-4 rounded-xl bg-yellow-500 text-black font-semibold mb-4"
            >
              Install LynQ
            </button>
          )}

          <button
            onClick={finishOnboarding}
            className="w-full py-4 rounded-xl border border-white/20 text-white"
          >
            Maybe Later
          </button>
        </>
      )}
    </div>
  );
}

function Feature({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 mb-5 last:mb-0">

      <div className="w-8 h-8 rounded-full bg-green-500 text-black flex items-center justify-center font-bold">
        ✓
      </div>

      <span className="text-lg text-white">
        {children}
      </span>

    </div>
  );
}