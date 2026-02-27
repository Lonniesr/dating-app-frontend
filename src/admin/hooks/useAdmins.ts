import { useQuery } from "@tanstack/react-query";
import adminAdminsService from "../services/adminAdminsService";

export function useAdmins() {
  return useQuery({
    queryKey: ["admin-admins"],
    queryFn: async () => {
      const response = await adminAdminsService.get();
      return response.data;
    },
  });
}
