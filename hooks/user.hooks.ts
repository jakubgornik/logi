import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { UserFormSchema as IUpdateUser } from "@/modules/settings/user-form.validation";
import { ROUTES } from "@/lib/routes";

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

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IUpdateUser }) => {
      const res = await api.put(`/user/${id}`, {
        ...data,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push(ROUTES.SETTINGS);
    },
  });
};

export { useCurrentUser, useUpdateUser };
