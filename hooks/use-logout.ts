import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      router.replace(ROUTES.SIGN_IN);
    },
  });
}
