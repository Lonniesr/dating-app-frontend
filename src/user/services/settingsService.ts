export const API = import.meta.env.VITE_API_URL;

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let json: any = null;

  try {
    json = await res.json();
  } catch {
    // handles empty responses (204 etc)
    json = null;
  }

  if (!res.ok) {
    throw new Error(json?.error || "Request failed");
  }

  return json as T;
}

/* ---------------- PROFILE ---------------- */

export function updateProfile(data: { name: string; bio: string }) {
  return request("/api/settings/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* ---------------- PASSWORD ---------------- */

export function changePassword(data: { currentPassword: string; newPassword: string }) {
  return request("/api/settings/password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ---------------- NOTIFICATIONS ---------------- */

export function updateNotifications(data: { push: boolean; email: boolean }) {
  return request("/api/settings/notifications", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* ---------------- THEME ---------------- */

export function updateTheme(data: { theme: "dark" | "light" }) {
  return request("/api/settings/theme", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* ---------------- ACCOUNT ---------------- */

export function deleteAccount() {
  return request("/api/settings/delete", {
    method: "DELETE",
  });
}

/* ---------------- LOGOUT ---------------- */

export function logout() {
  return request("/api/settings/logout", {
    method: "POST",
  });
}