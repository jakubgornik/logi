import { FiltersType } from "@/lib/types/common.types";
import { Prisma } from "@/prisma/client/client";

export const mapInventoryFiltersToWhere = (
  userId: string,
  filters?: FiltersType[]
): Prisma.InventoryWhereInput => {
  const where: Prisma.InventoryWhereInput = {
    userId,
  };

  if (!filters || filters.length === 0) return where;

  filters.forEach(({ column, value }) => {
    switch (column) {
      case "productName":
        where.product = {
          name: {
            contains: value,
            mode: "insensitive",
          },
        };
        break;
      case "quantity":
        const numValue = Number(value);
        if (!isNaN(numValue)) {
          where.quantity = numValue;
        }
        break;
      default:
        break;
    }
  });

  return where;
};
