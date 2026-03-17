const API = import.meta.env.VITE_API_URL;

export function useSwipe() {

  async function swipe(
    targetId: string,
    liked: boolean,
    superLike: boolean = false
  ) {

    console.log("➡️ Sending swipe", { targetId, liked, superLike });

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

    console.log("⬅️ Swipe response status:", res.status);

    let data: any = {};

    try {
      data = await res.json();
    } catch {
      console.warn("Swipe returned no JSON body");
    }

    if (!res.ok) {
      console.error("Swipe failed:", data);
      throw new Error("Swipe request failed");
    }

    /**
     * Trigger stats refresh event
     */

    window.dispatchEvent(new Event("swipe-updated"));

    return data;
  }

  return { swipe };

}