import { Navigate } from "react-router-dom";
import { useUserAuth } from "../../user/context/UserAuthContext";
import type { ReactNode } from "react";

export default function RouteGuard({
  children,
}: {
  children: ReactNode;
}) {
  const { authUser, isLoading } = useUserAuth();

  // 🔒 Wait until auth is finished loading
  if (isLoading) {
    return null; // or loading spinner
  }

  // ❌ Not logged in
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but NOT admin
  if (authUser.role !== "admin") {
    return <Navigate to="/user/dashboard" replace />;
  }

  // ✅ Admin allowed
  return <>{children}</>;
}