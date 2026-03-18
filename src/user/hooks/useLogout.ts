import { useQuery } from "@tanstack/react-query";

type EditProfileResponse = {
  name?: string;
  gender?: string;
  bio?: string | null;
  preferences?: {
    interestedIn?: string;
    minAge?: number;
    maxAge?: number;
    locationRadius?: number;
  };
  prompts?: { question: string; answer: string }[];
};

export function useEditProfile() {
  return useQuery<EditProfileResponse>({
    queryKey: ["profile"], // 🔥 unified key
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        {
          credentials: "include", // 🔥 REQUIRED
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load profile");
      }

      return data;
    },
  });
}