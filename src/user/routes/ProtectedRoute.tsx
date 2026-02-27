import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/useUserAuth";
import type { ReactNode } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { authUser, isLoading } = useUserAuth();

  if (isLoading) {
    return <div className="p-6 text-white">Loading…</div>;
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}