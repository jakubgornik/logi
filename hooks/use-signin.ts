import { useMutation } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { auth } from "@/lib/firebase";
import { AuthenticationForm } from "@/modules/auth/auth-form.validation";

export function useSignIn() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: AuthenticationForm) => {
      {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

        const idToken = await userCredential.user.getIdToken();

        const response = await api.post("/auth/signin", { idToken });
        return response.data;
      }
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });
}
