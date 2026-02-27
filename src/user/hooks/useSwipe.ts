import { useUserAuth } from "../context/UserAuthContext";

const API = import.meta.env.VITE_API_URL;

export function useSwipe() {
  const { refreshUser } = useUserAuth();

  async function swipe(targetId: string, direction: "left" | "right") {
    const res = await fetch(`${API}/api/swipe`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId, direction }),
    });

    const data = await res.json();

    // Refresh user in case a match was created
    await refreshUser();

    return data;
  }

  return { swipe };
}
