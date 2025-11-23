import api from "@/lib/axios";
import { PaginatedResponse } from "@/lib/types/common.types";
import { ISupplier, ISupplierQuery } from "@/modules/supplier/supplier.types";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export function useGetSuppliers(
  query: Partial<ISupplierQuery>,
  initialData?: PaginatedResponse<ISupplier>
) {
  const isFirstPage = query.page === 0;
  const hasNoFilters = !query.filters || query.filters.length === 0;
  const matchesInitialPageSize =
    initialData && query.pageSize === initialData.pageSize;

  const shouldUseInitialData =
    isFirstPage && hasNoFilters && matchesInitialPageSize;

  return useQuery({
    queryKey: ["supplier", query],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<ISupplier>>("/supplier", {
        params: query,
      });
      return res.data;
    },
    initialData: shouldUseInitialData ? initialData : undefined,
    placeholderData: keepPreviousData,
  });
}
