import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { TransactionFormSchema } from "@/modules/transaction/transaction-form.validation";
import { ITransactionQuery } from "@/modules/transaction/transaction.types";
import {
  MultipleIdsPayload,
  PaginatedResponse,
} from "@/lib/types/common.types";
import { Transaction } from "@/prisma/client/client";
import { shouldUseInitialData } from "@/lib/utils/should-use-initial-data";
import { useNotify } from "@/hooks/use-notify";

interface TransactionPayload {
  id: string;
  data: TransactionFormSchema;
}

const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotify();

  return useMutation({
    mutationFn: async (data: TransactionFormSchema) => {
      const res = await api.post("/transaction", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      showSuccess("Transaction created successfully");
    },
    onError: (err) => showError(err),
  });
};

const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotify();

  return useMutation({
    mutationFn: async ({ id, data }: TransactionPayload) => {
      const res = await api.put(`/transaction/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      showSuccess("Transaction updated successfully");
    },
    onError: (err) => showError(err),
  });
};

const useConfirmTransaction = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotify();

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
      showSuccess("Transaction confirmed successfully");
      router.push(ROUTES.TRANSACTION);
    },
    onError: (err) => showError(err),
  });
};

const useGetTransactions = (
  query: Partial<ITransactionQuery>,
  initialData?: PaginatedResponse<Transaction>
) => {
  return useQuery({
    queryKey: ["transaction", query],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Transaction>>(
        "/transaction",
        {
          params: query,
        }
      );
      return res.data;
    },
    initialData: shouldUseInitialData(query, initialData)
      ? initialData
      : undefined,
    placeholderData: keepPreviousData,
  });
};

const useDeleteTransaction = (
  options?: UseMutationOptions<unknown, Error, MultipleIdsPayload>
) => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotify();

  return useMutation({
    mutationFn: async (data: MultipleIdsPayload) => {
      const res = await api.delete("/transaction", {
        data,
      });
      return res.data;
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      showSuccess("Transactions deleted successfully");
      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
    onError: (err, ...args) => {
      showError(err);
      if (options?.onError) {
        options.onError(err, ...args);
      }
    },
  });
};

export {
  useCreateTransaction,
  useUpdateTransaction,
  useConfirmTransaction,
  useGetTransactions,
  useDeleteTransaction,
};
