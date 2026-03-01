import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../user/context/useUserAuth";

export default function AdminLogoutButton() {
  const navigate = useNavigate();
  const { logout } = useUserAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="
        w-full px-4 py-2 rounded-lg font-medium
        bg-[var(--lynq-dark-3)] text-gray-300
        hover:bg-[var(--gold)] hover:text-black
        transition
      "
    >
      Logout
    </button>
  );
}