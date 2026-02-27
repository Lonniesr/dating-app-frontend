import { useUserAuth } from "./context/UserAuthContext";

import ProfileEditSection from "./settings/ProfileEditSection";
import PreferencesSection from "./settings/PreferencesSection"; // ✅ ADDED
import ChangePasswordSection from "./settings/ChangePasswordSection";
import NotificationSettingsSection from "./settings/NotificationSettingsSection";
import PrivacySettingsSection from "./settings/PrivacySettingsSection";
import ThemeToggleSection from "./settings/ThemeToggleSection";
import LogoutSection from "./settings/LogoutSection";
import DeleteAccountSection from "./settings/DeleteAccountSection";

export default function SettingsPage() {
  const { authUser, isLoading } = useUserAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <p className="text-white/60">Loading settings…</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <p className="text-red-400">Unable to load settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-12">

        {/* Header */}
        <h1 className="text-4xl font-bold text-[#d4af37]">
          Settings
        </h1>

        {/* Sections */}
        <ProfileEditSection />

        {/* ✅ Preferences now visible */}
        <PreferencesSection />

        <ChangePasswordSection />
        <NotificationSettingsSection />
        <ThemeToggleSection />
        <LogoutSection />
        <DeleteAccountSection />

      </div>
    </div>
  );
}