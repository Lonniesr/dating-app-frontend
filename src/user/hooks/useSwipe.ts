import { useUserAuth } from "../context/UserAuthContext";

const API = import.meta.env.VITE_API_URL;

export function useSwipe() {
  const { refreshUser } = useUserAuth();

  async function swipe(
    targetId: string,
    liked: boolean,
    superLike: boolean = false
  ) {
    const res = await fetch(`${API}/api/swipe`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetId,
        liked,
        superLike,
      }),
    });

    if (!res.ok) {
      throw new Error("Swipe request failed");
    }

    const data = await res.json();

    // refresh user state (matches, stats, etc.)
    await refreshUser();

    return data;
  }

  return { swipe };
}