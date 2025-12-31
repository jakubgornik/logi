import { FiltersType } from "@/lib/types/common.types";
import { Prisma } from "@/prisma/client/client";

export const mapTransactionFiltersToWhere = (
  userId: string,
  filters?: FiltersType[]
): Prisma.TransactionWhereInput => {
  const where: Prisma.TransactionWhereInput = {};
  const and: Prisma.TransactionWhereInput[] = [];

  if (filters && filters.length > 0) {
    filters.forEach((filter) => {
      const { column, value } = filter;

      switch (column) {
        case "name":
          and.push({
            name: { contains: value, mode: "insensitive" },
          });
          break;
        case "status":
          and.push({
            status: { in: value },
          });
          break;
        default:
          break;
      }
    });
  }

  if (and.length > 0) {
    where.AND = and;
  }

  return {
    ...where,
    sellerId: userId,
  };
};
