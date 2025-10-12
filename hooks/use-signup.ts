import { AuthenticationForm } from "@/components/modules/auth/auth-form.validation";
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export function useSignUp() {
  return useMutation({
    mutationFn: async (data: AuthenticationForm) => {
      const response = await api.post("/auth/signup", data);
      return response.data;
    },
    onSuccess: () => {
      console.log("User signed up successfully");
    },
    onError: () => {
      console.error("Error signing up user:");
    },
  });
}
