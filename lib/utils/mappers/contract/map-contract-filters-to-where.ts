import { NumberRangeValue } from "@/components/filters/filters.types";
import { FiltersType } from "@/lib/types/common.types";
import { Prisma } from "@/prisma/client/client";
import { addDays, endOfDay, startOfDay } from "date-fns";

export const mapContractFiltersToWhere = (
  userId: string,
  filters?: FiltersType[]
): Prisma.ContractWhereInput => {
  const where: Prisma.ContractWhereInput = {};
  const and: Prisma.ContractWhereInput[] = [];

  if (filters?.length) {
    filters.forEach(({ column, value }) => {
      switch (column) {
        case "title":
          and.push({
            title: { contains: value, mode: "insensitive" },
          });
          break;
        case "validityDays":
          const validUntil: Prisma.DateTimeFilter = {};
          const now = new Date();

          if (value.min && !isNaN(Number(value.min))) {
            validUntil.gte = startOfDay(addDays(now, Number(value.min)));
          }
          if (value.max && !isNaN(Number(value.max))) {
            validUntil.lte = endOfDay(addDays(now, Number(value.max)));
          }
          if (validUntil.gte || validUntil.lte) {
            and.push({
              validUntil: validUntil,
            });
          }
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
    userId,
  };
};
