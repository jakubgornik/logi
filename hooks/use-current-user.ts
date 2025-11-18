import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get("/user/me");
      return res.data;
    },
  });
}
