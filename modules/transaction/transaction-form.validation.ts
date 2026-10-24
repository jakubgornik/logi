import { z } from "zod";
import type { InventoryWithProduct } from "@/lib/fetchers/get-inventories";
import { quantitySchema } from "@/lib/shared/quantity.validation";

const itemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: quantitySchema,
});

const transactionItemsSchema = z
  .array(itemSchema)
  .min(1, "At least one product is required")
  .superRefine((items, ctx) => {
    const seenProducts = new Set<string>();

    items.forEach((item, index) => {
      if (seenProducts.has(item.productId)) {
        ctx.addIssue({
          code: "custom",
          message: "This product is already selected",
          path: [index, "productId"],
        });
      }

      seenProducts.add(item.productId);
    });
  });

export const baseTransactionSchema = z.object({
  name: z.string().min(1, "Transaction name is required"),
  items: transactionItemsSchema,
  customerId: z.string().optional(),
});

export const customerSchema = baseTransactionSchema.extend({
  customerId: z.string().min(1, "Please select a customer"),
});

export type TransactionFormSchema = z.infer<typeof baseTransactionSchema>;

export const createDetailsSchema = (inventories: InventoryWithProduct[]) => {
  return baseTransactionSchema.extend({
    items: transactionItemsSchema.superRefine((items, ctx) =>
      validateTransactionStock(items, ctx, inventories),
    ),
  });
};

const validateTransactionStock = (
  items: z.infer<typeof itemSchema>[],
  ctx: z.RefinementCtx,
  inventories: InventoryWithProduct[]
) => {
  items.forEach((item, index) => {
    if (!item.productId) return;

    const inventoryItem = inventories.find(
      (inv) => inv.productId === item.productId
    );
    const exceedsAvailableStock =
      inventoryItem && item.quantity > inventoryItem.quantity;

    if (exceedsAvailableStock) {
      ctx.addIssue({
        code: "custom",
        message: `Limit exceeded (Max: ${inventoryItem.quantity})`,
        path: [index, "quantity"],
      });
    }
  });
};
