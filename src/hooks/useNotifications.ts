import { useQuery } from "@tanstack/react-query";

export type NotificationCounts = {
  unreadMessages: number;
  newLikes: number;
};

export function useNotifications() {
  return useQuery<NotificationCounts>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      return data;
    },

    refetchInterval: 15000
  });
}