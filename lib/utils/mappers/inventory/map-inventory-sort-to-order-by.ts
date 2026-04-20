import { Prisma } from "@/prisma/client/client";
import { SortBy } from "@/lib/types/common.types";

export const mapInventorySortToOrderBy = (
  sortBy?: SortBy[],
): Prisma.InventoryOrderByWithRelationInput[] => {
  if (!sortBy || sortBy.length === 0) {
    return [
      {
        product: {
          name: "asc",
        },
      },
    ];
  }

  return sortBy.map((sort) => {
    switch (sort.field) {
      case "productName":
        return {
          product: {
            name: sort.direction,
          },
        } as Prisma.InventoryOrderByWithRelationInput;
      case "quantity":
        return {
          quantity: sort.direction,
        } as Prisma.ContractOrderByWithRelationInput;
      default:
        return {
          product: {
            name: sort.direction,
          },
        } as Prisma.InventoryOrderByWithRelationInput;
    }
  });
};
