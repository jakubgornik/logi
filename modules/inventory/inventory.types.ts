import z from "zod";
import { IProduct, paginatedQuerySchema } from "@/lib/types/common.types";

export type IInventoryQuery = z.infer<typeof paginatedQuerySchema>;

export type IInventoryWithProduct = {
  id: string;
  quantity: number;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  product: IProduct;
};
