import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SupplierFormSchema as IUpdateSupplier } from "@/modules/supplier/supplier-form.validation";
import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";

interface UpdateSupplierParams {
  id: string;
  data: IUpdateSupplier;
}

export function useUpdateSupplier() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateSupplierParams) => {
      const res = await api.put(`/supplier/${id}`, {
        ...data,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["supplier"] });
      router.push(ROUTES.SUPPLIER);
    },
  });
}
