import { useQuery } from "@tanstack/react-query";
import { adminMessagesService } from "../services/adminMessagesService";

export function useMessages(userA: string, userB: string) {
  return useQuery({
    queryKey: ["admin-messages", userA, userB],
    queryFn: () =>
      adminMessagesService
        .get(`conversation?userA=${userA}&userB=${userB}`)
        .then(res => res.data),
    enabled: !!userA && !!userB,
  });
}
