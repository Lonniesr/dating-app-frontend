import { useState } from "react";
import {
  XMarkIcon,
  ShieldCheckIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { apiClient } from "../../services/apiClient";
import UserRolesManager from "./UserRolesManager";
import UserAnalytics from "./UserAnalytics";
import UserActivityTimeline from "./UserActivityTimeline";
import UserNotes from "./UserNotes";

interface UserDetail {
  id: string;
  name: string;
  email: string;
  photo?: string;
  banned?: boolean;
  photos?: string[];
  roles?: string[];
}

interface UserDetailDrawerProps {
  user: UserDetail | null;
  onClose: () => void;
  reloadUsers: () => void;
}

export default function UserDetailDrawer({
  user,
  onClose,
  reloadUsers,
}: UserDetailDrawerProps) {
  const [loadingAction, setLoadingAction] = useState(false);

  if (!user) return null;

  async function toggleBan() {
    try {
      setLoadingAction(true);

      const endpoint = user.banned
        ? "/admin/users/unban"
        : "/admin/users/ban";

      await apiClient.post(endpoint, { userId: user.id });
      await reloadUsers();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  }

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />

      {/* DRAWER */}
      <div
        className="
          fixed top-0 right-0 h-full w-[420px] bg-[#0d0d0d]
          border-l border-yellow-500/10 z-50 p-6 overflow-y-auto
          shadow-[0_0_25px_rgba(255,215,0,0.15)]
          animate-slideIn
        "
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* PROFILE HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user.photo}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border border-yellow-500/20"
          />
          <div>
            <div className="text-xl font-semibold text-gray-200">
              {user.name}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
            <div className="mt-1">
              {user.banned ? (
                <span className="text-red-400 text-sm">Banned</span>
              ) : (
                <span className="text-green-400 text-sm">Active</span>
              )}
            </div>
          </div>
        </div>

        {/* PHOTO GALLERY */}
        {user.photos?.length > 0 && (
          <div className="mb-6">
            <div className="text-gray-300 font-medium mb-2">Photos</div>
            <div className="grid grid-cols-3 gap-2">
              {user.photos.map((p, i) => (
                <img
                  key={i}
                  src={p}
                  className="w-full h-24 object-cover rounded-lg border border-yellow-500/10"
                />
              ))}
            </div>
          </div>
        )}

        {/* BAN / UNBAN BUTTON */}
        <button
          onClick={toggleBan}
          disabled={loadingAction}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg mb-6
            transition border
            ${
              user.banned
                ? "bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30"
                : "bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30"
            }
          `}
        >
          {user.banned ? (
            <>
              <UserPlusIcon className="w-5 h-5" />
              Unban User
            </>
          ) : (
            <>
              <UserMinusIcon className="w-5 h-5" />
              Ban User
            </>
          )}
        </button>

        {/* ROLES MANAGER */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheckIcon className="w-5 h-5 text-yellow-400" />
            <div className="text-gray-300 font-medium">Roles</div>
          </div>
          <UserRolesManager user={user} reloadUsers={reloadUsers} />
        </div>

        {/* ADMIN NOTES */}
        <div className="mb-8">
          <UserNotes userId={user.id} />
        </div>

        {/* ANALYTICS */}
        <div className="mb-8">
          <UserAnalytics userId={user.id} />
        </div>

        {/* ACTIVITY TIMELINE */}
        <div className="mb-8">
          <UserActivityTimeline userId={user.id} />
        </div>
      </div>
    </>
  );
}
