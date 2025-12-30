import { FiltersType } from "@/lib/types/common.types";
import { Prisma } from "@/prisma/client/client";

export const mapTransactionFiltersToWhere = (
  userId: string,
  filters?: FiltersType[]
): Prisma.TransactionWhereInput => {
  const where: Prisma.TransactionWhereInput = {};
  const and: Prisma.TransactionWhereInput[] = [];

  // todo

  return {
    ...where,
    sellerId: userId,
  };
};
