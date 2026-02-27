// src/user/guards/UserRouteGuard.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useUserAuth } from "../context/useUserAuth";
export default function UserRouteGuard({ children }: { children: ReactNode }) {
  const { authUser, isLoading } = useUserAuth();

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}