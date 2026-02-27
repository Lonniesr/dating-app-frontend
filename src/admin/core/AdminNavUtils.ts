// src/admin/core/AdminNavUtils.ts
import { adminNav } from "./NavConfig";

export const getAllNavItems = () =>
  adminNav.flatMap((section) => section.items);

export const findNavItem = (path: string) =>
  getAllNavItems().find((item) => path.startsWith(item.to));

export const getNavForRole = (role: string) =>
  adminNav.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => !item.roles || item.roles.includes(role)
    ),
  }));
