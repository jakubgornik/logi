import { Scope } from "@/prisma/client/enums";
import { z } from "zod";

export const inventorySchema = z.object({
  contractId: z.string().min(1, "Contract is required"),
  name: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  scope: z.enum(Scope),
});

export type InventoryFormSchema = z.infer<typeof inventorySchema>;
