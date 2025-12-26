import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import { CustomerFormSchema as ICreateCustomer } from "@/modules/customer/customer-form.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useCreateCustomer = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateCustomer) => {
      const res = await api.post("/customer", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      router.push(ROUTES.CUSTOMER);
    },
  });
};

export { useCreateCustomer };
