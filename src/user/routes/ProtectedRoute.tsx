import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import type { ReactNode } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { authUser, isLoading } = useUserAuth();

  // ⏳ Wait for auth state to resolve
  if (isLoading) {
    return null; // prevent flicker / unwanted redirects
  }

  // 🔐 Not logged in
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in
  return <>{children}</>;
}