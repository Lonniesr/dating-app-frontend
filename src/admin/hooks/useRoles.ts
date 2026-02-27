import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminRolesService } from "../services/adminRolesService";

export function useRoles() {
  return useQuery({
    queryKey: ["admin-roles"],
    queryFn: () => adminRolesService.listRoles(),
  });
}

export function useUsersByRole(role: string) {
  return useQuery({
    queryKey: ["admin-role-users", role],
    queryFn: () => adminRolesService.listUsersByRole(role),
    enabled: !!role,
  });
}

export function useAssignRole() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminRolesService.assignRole(userId, role),

    onSuccess: () => {
      // Refresh all role-related queries
      qc.invalidateQueries({ queryKey: ["admin-roles"] });
      qc.invalidateQueries({ queryKey: ["admin-role-users"] });
    },
  });
}
