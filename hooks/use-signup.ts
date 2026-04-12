import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import { AuthenticationForm } from "@/modules/auth/auth-form.validation";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useNotify } from "./use-notify";

export function useSignUp() {
  const router = useRouter();
  const { showSuccess, showError } = useNotify();

  return useMutation({
    mutationFn: async (data: AuthenticationForm) => {
      const response = await api.post("/auth/signup", data);
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Account created successfully. Please sign in.");
      router.replace(ROUTES.SIGN_IN);
    },
    onError: (error) => showError(error),
  });
}
