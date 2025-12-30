import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { TransactionFormSchema } from "@/modules/transaction/transaction-form.validation";

const useConfirmTransaction = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TransactionFormSchema) => {
      console.log(data);
      const res = await api.post("/transaction", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      router.push(ROUTES.TRANSACTION);
    },
  });
};

const useUpsertTransaction = () => {
  return useMutation({
    mutationFn: async (data: TransactionFormSchema) => {
      console.log(data);
      const res = await api.put("/transaction", {
        ...data,
      });
      return res.data;
    },
  });
};

export { useConfirmTransaction, useUpsertTransaction };
