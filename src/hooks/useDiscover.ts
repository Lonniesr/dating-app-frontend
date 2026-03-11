import { useQuery } from "@tanstack/react-query";

type DiscoverUser = {
  id: string;
  name: string;
  birthdate?: string | null;
  photos?: string[];
};

type DiscoverCard = {
  id: string;
  name: string;
  age: number | null;
  photo: string;
};

function calculateAge(birthdate: string) {
  const today = new Date();
  const birth = new Date(birthdate);

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function useDiscover() {
  return useQuery<DiscoverCard[]>({
    queryKey: ["discover"],

    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/discover`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`Discover API failed: ${res.status}`);
      }

      const json = await res.json();

      const users: DiscoverUser[] = json.profiles ?? [];

      return users.map((u) => ({
        id: u.id,
        name: u.name,
        age: u.birthdate ? calculateAge(u.birthdate) : null,
        photo:
          u.photos && u.photos.length > 0
            ? u.photos[0]
            : "https://picsum.photos/600",
      }));
    },

    staleTime: 1000 * 30,
  });
}