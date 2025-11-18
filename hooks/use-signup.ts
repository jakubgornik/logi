import api from "@/lib/axios";
import { AuthenticationForm } from "@/modules/auth/auth-form.validation";
import { useMutation } from "@tanstack/react-query";

export function useSignUp() {
  return useMutation({
    mutationFn: async (data: AuthenticationForm) => {
      const response = await api.post("/auth/signup", data);
      return response.data;
    },
    // TODO: add notifications
  });
}
