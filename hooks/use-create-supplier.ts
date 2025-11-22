import api from "@/lib/axios";
import { SupplierFormSchema as ICreateSupplier } from "@/modules/supplier/supplier-form.validation";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useCreateSupplier() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ICreateSupplier) => {
      const res = await api.post("/supplier", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });
}
