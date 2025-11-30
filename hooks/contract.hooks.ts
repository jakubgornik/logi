import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import { ContractFormSchema as ICreateContract } from "@/modules/contract/contract-form.validation";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useCreateContract = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ICreateContract) => {
      const res = await api.post("/contract", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      router.push(ROUTES.DASHBOARD);
    },
  });
};

export { useCreateContract };
