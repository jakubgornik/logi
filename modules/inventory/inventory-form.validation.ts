import { Scope } from "@/prisma/client/enums";
import { z } from "zod";
import { quantitySchema } from "@/lib/shared/quantity.validation";

export const inventorySchema = z.object({
  contractId: z.string().min(1, "Contract is required"),
  name: z.string().min(1, "Product is required"),
  quantity: quantitySchema,
  scope: z.enum(Scope),
});

export type InventoryFormSchema = z.infer<typeof inventorySchema>;
