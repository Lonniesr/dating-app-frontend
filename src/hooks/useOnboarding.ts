import { useState } from "react";
import onboardingClient from "@/lib/onboardingClient";

export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateInvite = async (inviteCode: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await onboardingClient.validateInvite(inviteCode);
      return res;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invite validation failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    inviteCode: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const res = await onboardingClient.register({
        email,
        username,
        password,
        inviteCode,
      });
      return res;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await onboardingClient.login(email, password);
      return res;
    } catch (err: any) {
      setError(err?.response?.data?.error || "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await onboardingClient.completeOnboarding();
      return res;
    } catch (err: any) {
      setError("Failed to complete onboarding");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    validateInvite,
    register,
    login,
    completeOnboarding,
  };
}