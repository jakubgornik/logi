import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import { PaginatedResponse } from "@/lib/types/common.types";
import { shouldUseInitialData } from "@/lib/utils/should-use-initial-data";
import { ContractFormSchema as ICreateContract } from "@/modules/contract/contract-form.validation";
import { IContractQuery } from "@/modules/contract/contract.types";
import { Contract } from "@/prisma/client/client";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useGetContracts = (
  query: Partial<IContractQuery>,
  initialData?: PaginatedResponse<Contract>
) => {
  return useQuery({
    queryKey: ["contract", query],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Contract>>("/contract", {
        params: query,
      });
      return res.data;
    },
    initialData: shouldUseInitialData(query, initialData)
      ? initialData
      : undefined,
    placeholderData: keepPreviousData,
  });
};

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

export { useCreateContract, useGetContracts };
