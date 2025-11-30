import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import {
  MultipleIdsPayload,
  PaginatedResponse,
} from "@/lib/types/common.types";
import { SupplierFormSchema as ICreateSupplier } from "@/modules/supplier/supplier-form.validation";
import { SupplierFormSchema as IUpdateSupplier } from "@/modules/supplier/supplier-form.validation";
import {
  ISupplierWithId,
  ISupplierQuery,
} from "@/modules/supplier/supplier.types";
import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useGetSuppliers = (
  query: Partial<ISupplierQuery>,
  initialData?: PaginatedResponse<ISupplierWithId>
) => {
  const isFirstPage = query.page === 0;
  const hasNoFilters = !query.filters || query.filters.length === 0;
  const hasNoSorting = !query.sortBy || query.sortBy.length === 0;
  const matchesInitialPageSize =
    initialData && query.pageSize === initialData.pageSize;

  const shouldUseInitialData =
    isFirstPage && hasNoFilters && hasNoSorting && matchesInitialPageSize;

  return useQuery({
    queryKey: ["supplier", query],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<ISupplierWithId>>(
        "/supplier",
        {
          params: query,
        }
      );
      return res.data;
    },
    initialData: shouldUseInitialData ? initialData : undefined,
    placeholderData: keepPreviousData,
  });
};

const useCreateSupplier = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateSupplier) => {
      const res = await api.post("/supplier", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
      router.push(ROUTES.SUPPLIER);
    },
  });
};

const useDeleteSupplier = (
  options?: UseMutationOptions<unknown, Error, MultipleIdsPayload>
) => {
  const queryClient = useQueryClient();

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
      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
  });
};

const useUpdateSupplier = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IUpdateSupplier }) => {
      const res = await api.put(`/supplier/${id}`, {
        ...data,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["supplier"] });
      router.push(ROUTES.SUPPLIER);
    },
  });
};

export {
  useCreateSupplier,
  useDeleteSupplier,
  useGetSuppliers,
  useUpdateSupplier,
};
