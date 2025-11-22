import api from "@/lib/axios";
import { MultipleIdsPayload } from "@/lib/types/common.types";
import { useMutation } from "@tanstack/react-query";

export function useDeleteSupplier() {
  return useMutation({
    mutationFn: async (data: MultipleIdsPayload) => {
      const res = await api.delete("/supplier", {
        data,
      });
      return res.data;
    },
  });
}
