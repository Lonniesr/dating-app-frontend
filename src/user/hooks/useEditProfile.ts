import { useQuery } from "@tanstack/react-query";

type EditProfileResponse = {
  name: string;
  gender: string;
  preferences: string;
};

export function useEditProfile() {
  return useQuery<EditProfileResponse>({
    queryKey: ["edit-profile"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/edit`,
        { credentials: "include" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      return data;
    }
  });
}
