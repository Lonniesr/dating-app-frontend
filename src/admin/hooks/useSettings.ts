import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminSettingsService, type Setting } from "../services/adminSettingsService";

export function useSettings() {
  return useQuery<Setting[]>({
    queryKey: ["admin-settings"],
    queryFn: () => adminSettingsService.list(),
  });
}

export function useUpdateSetting() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      adminSettingsService.save(key, value),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
    },
  });
}
