import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

export default function ProtectedRoute() {
  const { authUser, isLoading } = useUserAuth();
  const location = useLocation();

  /* WAIT FOR AUTH */

  if (isLoading) {
    return null;
  }

  /* NOT LOGGED IN */

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  /* ADMIN */

  if (authUser.role === "admin") {
    if (!location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
  }

  /* NORMAL USER */

  return <Outlet />;
}