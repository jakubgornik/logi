import { Prisma } from "@/prisma/client/client";
import { SortBy } from "@/lib/types/common.types";

export const mapCustomerSortToOrderBy = (
  sortBy?: SortBy[]
): Prisma.CustomerOrderByWithRelationInput[] => {
  if (!sortBy || sortBy.length === 0) {
    return [{ createdAt: "asc" }];
  }

  return sortBy.map((sort) => {
    switch (sort.field) {
      case "customerName":
        return { customerName: sort.direction };
      default:
        return { customerName: sort.direction };
    }
  });
};
