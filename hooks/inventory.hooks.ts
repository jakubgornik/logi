import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import { PaginatedResponse } from "@/lib/types/common.types";
import { shouldUseInitialData } from "@/lib/utils/should-use-initial-data";
import {
  IInventoryQuery,
  IInventoryWithProduct,
} from "@/modules/inventory/inventory.types";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { InventoryFormSchema as IAddInventory } from "@/modules/inventory/inventory-form.validation";

const useGetInventory = (
  query: Partial<IInventoryQuery>,
  initialData?: PaginatedResponse<IInventoryWithProduct>
) => {
  return useQuery({
    queryKey: ["inventory", query],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<IInventoryWithProduct>>(
        "/inventory",
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

const useAddInventory = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: IAddInventory) => {
      const res = await api.post("/inventory", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      router.push(ROUTES.INVENTORY);
    },
  });
};

export { useAddInventory, useGetInventory };
