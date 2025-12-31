import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import {
  MultipleIdsPayload,
  PaginatedResponse,
} from "@/lib/types/common.types";
import { shouldUseInitialData } from "@/lib/utils/should-use-initial-data";
import { SupplierFormSchema as ICreateSupplier } from "@/modules/supplier/supplier-form.validation";
import { SupplierFormSchema as IUpdateSupplier } from "@/modules/supplier/supplier-form.validation";
import { ISupplierQuery } from "@/modules/supplier/supplier.types";
import { Supplier } from "@/prisma/client/client";
import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useNotify } from "./use-notify";

const useGetSuppliers = (
  query: Partial<ISupplierQuery>,
  initialData?: PaginatedResponse<Supplier>
) => {
  return useQuery({
    queryKey: ["supplier", query],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Supplier>>("/supplier", {
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

const useCreateSupplier = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotify();

  return useMutation({
    mutationFn: async (data: ICreateSupplier) => {
      const res = await api.post("/supplier", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
      showSuccess("Supplier created successfully");
      router.push(ROUTES.SUPPLIER);
    },
    onError: (err) => showError(err),
  });
};

const useDeleteSupplier = (
  options?: UseMutationOptions<unknown, Error, MultipleIdsPayload>
) => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotify();

  return useMutation({
    mutationFn: async (data: MultipleIdsPayload) => {
      const res = await api.delete("/supplier", {
        data,
      });
      return res.data;
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
      showSuccess("Suppliers deleted successfully");
      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
    onError: (err) => showError(err),
  });
};

const useUpdateSupplier = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotify();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IUpdateSupplier }) => {
      const res = await api.put(`/supplier/${id}`, {
        ...data,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["supplier"] });
      showSuccess("Supplier updated successfully");
      router.push(ROUTES.SUPPLIER);
    },
    onError: (err) => showError(err),
  });
};

export {
  useCreateSupplier,
  useDeleteSupplier,
  useGetSuppliers,
  useUpdateSupplier,
};
