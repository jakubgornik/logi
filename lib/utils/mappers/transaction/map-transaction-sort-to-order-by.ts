import { Prisma } from "@/prisma/client/client";
import { SortBy } from "@/lib/types/common.types";

export const mapTransactionSortToOrderBy = (
  sortBy?: SortBy[]
): Prisma.TransactionOrderByWithRelationInput[] => {
  if (!sortBy || sortBy.length === 0) {
    return [{ createdAt: "desc" }];
  }

  return sortBy.map((sort) => {
    switch (sort.field) {
      case "name":
        return { name: sort.direction };
      case "status":
        return { status: sort.direction };
      case "createdAt":
        return { createdAt: sort.direction };
      default:
        return { createdAt: "desc" };
    }
  });
};
