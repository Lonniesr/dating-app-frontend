import { useQuery } from "@tanstack/react-query";

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
  return useQuery({
    queryKey: ["discover"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/discover`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch discover feed");
      }

      const users = await res.json();

      return users.map((u: any) => ({
        id: u.id,
        name: u.name,
        age: u.birthdate ? calculateAge(u.birthdate) : 0,
        photo: u.photos?.[0] || "",
      }));
    },
  });
}