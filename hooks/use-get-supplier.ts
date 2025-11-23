import api from "@/lib/axios";
import { PaginatedResponse } from "@/lib/types/common.types";
import { ISupplier, ISupplierQuery } from "@/modules/supplier/supplier.types";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export function useGetSuppliers(query: Partial<ISupplierQuery>) {
  return useQuery({
    queryKey: ["supplier", query],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<ISupplier>>("/supplier", {
        params: query,
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
}
