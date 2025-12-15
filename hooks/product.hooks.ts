import api from "@/lib/axios";
import { ROUTES } from "@/lib/routes";
import { ProductFormSchema as IAddProduct } from "@/modules/product/product-form.validation";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useAddProducts = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: IAddProduct) => {
      const res = await api.post("/product", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      router.push(ROUTES.PRODUCT);
    },
  });
};

export { useAddProducts };
