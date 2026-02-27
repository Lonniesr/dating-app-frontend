export const API = import.meta.env.VITE_API_URL;

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    ...options,
  });

  let json: any = null;

  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    throw new Error(json?.error || "Request failed");
  }

  return json as T;
}

export function updateProfile(data: { name: string; bio: string }) {
  return request("/api/settings/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function changePassword(data: { oldPassword: string; newPassword: string }) {
  return request("/api/settings/password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function updateNotifications(data: { push: boolean; email: boolean }) {
  return request("/api/settings/notifications", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function updatePrivacy(data: { showAge: boolean; showLocation: boolean }) {
  return request("/api/settings/privacy", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function updateTheme(data: { theme: "dark" | "light" }) {
  return request("/api/settings/theme", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function deleteAccount() {
  return request("/api/settings/delete", {
    method: "DELETE",
  });
}

export function logout() {
  return request("/api/settings/logout", {
    method: "POST",
  });
}
