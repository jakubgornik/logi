import api from "@/lib/axios";
import { SupplierFormSchema as ICreateSupplier } from "@/modules/supplier/supplier-form.validation";
import { useMutation } from "@tanstack/react-query";

export function useCreateSupplier() {
  return useMutation({
    mutationFn: async (data: ICreateSupplier) => {
      const res = await api.post("/supplier/create", {
        ...data,
      });
      return res.data;
    },
  });
}
