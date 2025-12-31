import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { UserFormSchema as IUpdateUser } from "@/modules/settings/user-form.validation";
import { ROUTES } from "@/lib/routes";
import { AppUserSearchResult } from "@/modules/customer/customer.types";
import { useNotify } from "./use-notify";

function useCurrentUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get("/user");
      return res.data;
    },
  });
}

const useUpdateUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotify();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IUpdateUser }) => {
      const res = await api.put(`/user/${id}`, {
        ...data,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      showSuccess("User updated successfully");
      router.push(ROUTES.SETTINGS);
    },
    onError: (err) => showError(err),
  });
};

const useGetAppUsersToLink = (query: { search?: string }) => {
  return useQuery({
    queryKey: ["user", query],
    queryFn: async () => {
      const res = await api.get<AppUserSearchResult[]>(
        "/user/link-to-customer",
        {
          params: query,
        }
      );
      return res.data;
    },
    enabled: !!query.search,
  });
};

export { useCurrentUser, useUpdateUser, useGetAppUsersToLink };
