import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

export default function ProtectedRoute() {
  const { authUser, isLoading } = useUserAuth();
  const location = useLocation();

  /* WAIT FOR AUTH TO FINISH */

  if (isLoading) {
    return null;
  }

  /* AUTH NOT RESOLVED YET */
  /* Prevent redirect flicker when refreshing deep routes like /user/messages/:id */

  if (authUser === undefined) {
    return null;
  }

  /* NOT LOGGED IN */

  if (!authUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  /* ADMIN ROUTING */

  if (authUser.role === "admin") {
    if (!location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
  }

  /* NORMAL USER */

  return <Outlet />;
}