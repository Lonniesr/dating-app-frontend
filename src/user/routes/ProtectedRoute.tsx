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

  // 🔧 1. Always wait for auth to resolve FIRST
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }

  // 🔧 2. Only redirect AFTER loading is complete
  if (!authUser) {
    console.log("Redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🔧 3. Admin routing
  if (authUser.role === "admin") {
    if (!location.pathname.startsWith("/admin")) {
      console.log("Redirecting admin → /admin/dashboard");
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
  }

  // 🔧 4. Normal user routing
  console.log("Rendering protected user route");
  return <Outlet />;
}