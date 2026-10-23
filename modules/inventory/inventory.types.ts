import z from "zod";
import { IProduct, paginatedQuerySchema } from "@/lib/types/common.types";
import type { IContractWithSupplier } from "@/modules/contract/contract.types";

export type InventoryContractOption = Pick<
  IContractWithSupplier,
  "id" | "title" | "supplier"
>;

export type IInventoryQuery = z.infer<typeof paginatedQuerySchema>;

export type IInventoryWithProduct = {
  id: string;
  quantity: number;
  userId: string;
  productId: string;
  updatedAt: Date;
  product: IProduct;
};
