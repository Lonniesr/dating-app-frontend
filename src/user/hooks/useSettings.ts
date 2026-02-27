import { useMutation } from "@tanstack/react-query";
import {
  updateProfile,
  changePassword,
  updateNotifications,
  updatePrivacy,
  updateTheme,
  deleteAccount,
  logout,
} from "../services/settingsService";

export function useSettings() {
  return {
    updateProfile: useMutation({ mutationFn: updateProfile }),
    changePassword: useMutation({ mutationFn: changePassword }),
    updateNotifications: useMutation({ mutationFn: updateNotifications }),
    updatePrivacy: useMutation({ mutationFn: updatePrivacy }),
    updateTheme: useMutation({ mutationFn: updateTheme }),
    deleteAccount: useMutation({ mutationFn: deleteAccount }),
    logout: useMutation({ mutationFn: logout }),
  };
}
