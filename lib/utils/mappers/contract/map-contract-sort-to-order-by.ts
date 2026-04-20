import { Prisma } from "@/prisma/client/client";
import { SortBy } from "@/lib/types/common.types";

export const mapContractSortToOrderBy = (
  sortBy?: SortBy[],
): Prisma.ContractOrderByWithRelationInput[] => {
  if (!sortBy || sortBy.length === 0) {
    return [{ createdAt: "asc" }];
  }

  return sortBy.map((sort) => {
    switch (sort.field) {
      case "title":
        return {
          title: sort.direction,
        } as Prisma.ContractOrderByWithRelationInput;
      case "validUntil":
        return {
          validUntil: sort.direction,
        } as Prisma.ContractOrderByWithRelationInput;
      default:
        return {
          title: sort.direction,
        } as Prisma.ContractOrderByWithRelationInput;
    }
  });
};
