import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      window.location.replace(ROUTES.SIGN_IN);
    },
  });
}
