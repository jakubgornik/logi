import { z } from "zod";
import { InventoryWithProduct } from "@/lib/fetchers/get-inventories";

const itemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z
    .number()
    .or(z.nan())
    .refine((val) => !Number.isNaN(val), { message: "Quantity is required" })
    .refine((val) => val > 0, { message: "Quantity must be at least 1" }),
});

export const baseTransactionSchema = z.object({
  name: z.string().min(1, "Transaction name is required"),
  items: z.array(itemSchema),
  customerId: z.string().optional(),
});

export const customerSchema = baseTransactionSchema.extend({
  customerId: z.string().min(1, "Please select a customer"),
});

export type TransactionFormSchema = z.infer<typeof baseTransactionSchema>;

export const createDetailsSchema = (inventories: InventoryWithProduct[]) => {
  return baseTransactionSchema.extend({
    items: z
      .array(itemSchema)
      .superRefine((items, ctx) =>
        validateTransactionItems(items, ctx, inventories)
      ),
  });
};

const validateTransactionItems = (
  items: z.infer<typeof itemSchema>[],
  ctx: z.RefinementCtx,
  inventories: InventoryWithProduct[]
) => {
  const seenProducts = new Map<string, number>();

  items.forEach((item, index) => {
    if (!item.productId) return;

    if (seenProducts.has(item.productId)) {
      ctx.addIssue({
        code: "custom",
        message: "This product is already selected",
        path: [index, "productId"],
      });
    } else {
      seenProducts.set(item.productId, index);
    }

    const inventoryItem = inventories.find(
      (inv) => inv.productId === item.productId
    );
    if (inventoryItem && item.quantity > inventoryItem.quantity) {
      ctx.addIssue({
        code: "custom",
        message: `Limit exceeded (Max: ${inventoryItem.quantity})`,
        path: [index, "quantity"],
      });
    }
  });
};
