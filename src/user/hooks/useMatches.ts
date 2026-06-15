import { useQuery } from "@tanstack/react-query";

type MatchUser = {
  id: string;
  name: string;
  gender?: string;
  photos?: string[];
  age?: number;
  location?: string;
};

function calculateAge(birthdate?: string) {
  if (!birthdate) return undefined;

  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

  export function useMatches() {
return useQuery<{
  matches: MatchUser[];
  likes: MatchUser[];
}>({
  queryKey: ["matches"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/matches`,
        { credentials: "include" }
      );

      const data = await res.json();
      console.log("MATCHES API RESPONSE:", data);
console.log("🔥 RAW MATCH RESPONSE:", data);
      if (!res.ok) throw new Error(data.error);

     const mapUser = (user: any) => ({
  id: user.id,
  name: user.name,
  gender: user.gender,
  photos: Array.isArray(user.photos) ? user.photos : [],
  age: calculateAge(user.birthdate),
  location: user.location,
});

return {
  matches: Array.isArray(data.matches)
    ? data.matches.map(mapUser)
    : [],
  likes: Array.isArray(data.likes)
    ? data.likes.map(mapUser)
    : [],
};
    },
  });
}