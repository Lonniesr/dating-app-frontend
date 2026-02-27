// src/api/auth.ts

export async function login(email: string, password: string) {
  const res = await fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include", // ⭐ REQUIRED: allows cookie to be stored
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

export async function logout() {
  const res = await fetch("http://localhost:3001/api/auth/logout", {
    method: "POST",
    credentials: "include", // ⭐ REQUIRED: clears cookie
  });

  return res.json();
}