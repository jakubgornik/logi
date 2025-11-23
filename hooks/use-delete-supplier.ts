import api from "@/lib/axios";
import { MultipleIdsPayload } from "@/lib/types/common.types";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export function useDeleteSupplier(
  options?: UseMutationOptions<unknown, Error, MultipleIdsPayload>
) {
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
}
