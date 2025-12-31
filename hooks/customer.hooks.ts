import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import {
  MultipleIdsPayload,
  PaginatedResponse,
} from "@/lib/types/common.types";
import { shouldUseInitialData } from "@/lib/utils/should-use-initial-data";
import { CustomerFormSchema as ICreateCustomer } from "@/modules/customer/customer-form.validation";
import { ICustomerQuery } from "@/modules/customer/customer.types";
import { Customer } from "@/prisma/client/client";
import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useNotify } from "./use-notify";

const useCreateCustomer = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotify();

  return useMutation({
    mutationFn: async (data: ICreateCustomer) => {
      const res = await api.post("/customer", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      showSuccess("Customer created successfully");
      router.push(ROUTES.CUSTOMER);
    },
    onError: (err) => showError(err),
  });
};

const useGetCustomers = (
  query: Partial<ICustomerQuery>,
  initialData?: PaginatedResponse<Customer>
) => {
  return useQuery({
    queryKey: ["customer", query],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Customer>>("/customer", {
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

const useDeleteCustomer = (
  options?: UseMutationOptions<unknown, Error, MultipleIdsPayload>
) => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotify();

  return useMutation({
    mutationFn: async (data: MultipleIdsPayload) => {
      const res = await api.delete("/customer", {
        data,
      });
      return res.data;
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      showSuccess("Customers deleted successfully");
      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
    onError: (err) => showError(err),
  });
};

export { useCreateCustomer, useGetCustomers, useDeleteCustomer };
