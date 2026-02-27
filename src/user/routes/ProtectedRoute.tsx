import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="p-6 text-white">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
