import { FiltersType } from "@/lib/types/common.types";
import { Prisma } from "@/prisma/client/client";

export const mapCustomerFiltersToWhere = (
  userId: string,
  filters?: FiltersType[]
): Prisma.CustomerWhereInput => {
  const where: Prisma.CustomerWhereInput = {};
  const and: Prisma.CustomerWhereInput[] = [];

  if (filters && filters.length > 0) {
    filters.forEach((filter) => {
      const { column, value } = filter;

      switch (column) {
        case "customerName":
          and.push({
            customerName: { contains: value, mode: "insensitive" },
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
