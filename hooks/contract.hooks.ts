import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import {
  MultipleIdsPayload,
  PaginatedResponse,
} from "@/lib/types/common.types";
import { shouldUseInitialData } from "@/lib/utils/should-use-initial-data";
import { ContractFormSchema as ICreateContract } from "@/modules/contract/contract-form.validation";
import {
  IContractQuery,
  IContractWithSupplier,
} from "@/modules/contract/contract.types";
import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useGetContracts = (
  query: Partial<IContractQuery>,
  initialData?: PaginatedResponse<IContractWithSupplier>
) => {
  return useQuery({
    queryKey: ["contract", query],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<IContractWithSupplier>>(
        "/contract",
        {
          params: query,
        }
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
    initialData: shouldUseInitialData(query, initialData)
      ? initialData
      : undefined,
  });
};

const useCreateContract = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateContract) => {
      const res = await api.post("/contract", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract"] });
      router.push(ROUTES.CONTRACT);
    },
  });
};

const useDeleteContract = (
  options?: UseMutationOptions<unknown, Error, MultipleIdsPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MultipleIdsPayload) => {
      const res = await api.delete("/contract", {
        data,
      });
      return res.data;
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["contract"] });
      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
  });
};

export { useCreateContract, useGetContracts, useDeleteContract };
