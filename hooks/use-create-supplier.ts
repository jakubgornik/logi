import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import { SupplierFormSchema as ICreateSupplier } from "@/modules/supplier/supplier-form.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useCreateSupplier() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateSupplier) => {
      const res = await api.post("/supplier", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
      router.push(ROUTES.SUPPLIER);
    },
  });
}
