const API = import.meta.env.VITE_API_URL;

export async function fetchAllProfiles() {
  try {
    const res = await fetch(`${API}/api/discover`, {
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Error fetching profiles:", res.status);
      return [];
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching profiles:", err);
    return [];
  }
}

export async function getProfileWithPhotos(userId: string) {
  try {
    const res = await fetch(`${API}/api/user/${userId}`, {
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Error fetching profile:", res.status);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
}