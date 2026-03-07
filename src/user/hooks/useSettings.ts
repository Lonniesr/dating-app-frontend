import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfile,
  changePassword,
  updateNotifications,
  updateTheme,
  deleteAccount,
  logout,
} from "../services/settingsService";

type UpdateProfileInput = {
  name: string;
  bio: string;
};

type UpdateThemeInput = {
  theme: "light" | "dark";
};

type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

type NotificationsInput = {
  push: boolean;
  email: boolean;
};

export function useSettings() {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileInput) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordInput) => changePassword(data),
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: (data: NotificationsInput) => updateNotifications(data),
  });

  const updateThemeMutation = useMutation({
    mutationFn: (data: UpdateThemeInput) => updateTheme(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    updateProfile: updateProfileMutation,
    changePassword: changePasswordMutation,
    updateNotifications: updateNotificationsMutation,
    updateTheme: updateThemeMutation,
    deleteAccount: deleteAccountMutation,
    logout: logoutMutation,
  };
}