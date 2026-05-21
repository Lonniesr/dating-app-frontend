import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

export default function ProtectedRoute() {
  const { authUser, isLoading } = useUserAuth();
  const location = useLocation();

  console.log("ProtectedRoute:", {
    path: location.pathname,
    isLoading,
    authUser,
  });

  // ✅ 1. Wait for auth to fully resolve
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }

  // ✅ 2. IMPORTANT: Allow internal navigation without instant redirect
  if (!authUser) {
    // 👇 if user came from inside app, DON'T immediately kick them out
    if (location.state?.from) {
      console.log("Auth temporarily missing, staying on page...");
      return <Outlet />;
    }

    console.log("Redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ✅ 3. Admin routing
  if (authUser?.role === "admin") {
    if (!location.pathname.startsWith("/admin")) {
      console.log("Redirecting admin → /admin/dashboard");
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
  }

  // ✅ 4. Normal user routing
  return <Outlet />;
}