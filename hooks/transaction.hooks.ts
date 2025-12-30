import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { TransactionFormSchema } from "@/modules/transaction/transaction-form.validation";

interface TransactionPayload {
  id: string;
  data: TransactionFormSchema;
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TransactionFormSchema) => {
      const res = await api.post("/transaction", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: TransactionPayload) => {
      const res = await api.put(`/transaction/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
    },
  });
};

export const useConfirmTransaction = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: TransactionPayload) => {
      const res = await api.put(`/transaction/${id}`, {
        ...data,
        status: "CONFIRMED",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      router.push(ROUTES.TRANSACTION);
    },
  });
};
