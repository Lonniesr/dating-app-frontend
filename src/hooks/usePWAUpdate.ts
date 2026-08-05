import { useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";

export default function usePWAUpdate() {
  const [updateAvailable, setUpdateAvailable] =
    useState(false);

  const [offlineReady, setOfflineReady] =
    useState(false);

  const [updateServiceWorker, setUpdateServiceWorker] =
    useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    const updateSW = registerSW({
      immediate: true,

      onNeedRefresh() {
        console.log("🚀 New LynQ version available.");

        setUpdateAvailable(true);
      },

      onOfflineReady() {
        console.log("✅ LynQ ready for offline use.");

        setOfflineReady(true);
      },
    });

    setUpdateServiceWorker(() => updateSW);
  }, []);

 async function updateApp() {
  if (!updateServiceWorker) return;

  await updateServiceWorker();
}

  return {
    updateAvailable,
    offlineReady,
    updateApp,
  };
}