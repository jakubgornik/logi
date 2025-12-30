import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { PaginatedResponse, ServiceResult } from "@/lib/types/common.types";
import { Transaction } from "@/prisma/client/client";
import { ITransactionQuery } from "@/modules/transaction/transaction.types";
import { mapTransactionFiltersToWhere } from "../utils/mappers/transaction/map-transaction-to-where";
import { mapTransactionSortToOrderBy } from "../utils/mappers/transaction/map-transaction-sort-to-order-by";

type TransactionArgs = Partial<ITransactionQuery> & {
  userId: string;
  fetchAll?: boolean;
};

export const getTransactions = cache(
  async ({
    userId,
    page = 0,
    pageSize = 10,
    sortBy = [],
    filters = [],
    fetchAll = false,
  }: TransactionArgs): Promise<
    ServiceResult<PaginatedResponse<Transaction>>
  > => {
    const skip = fetchAll ? undefined : page * pageSize;
    const take = fetchAll ? undefined : pageSize;

    const orderBy = mapTransactionSortToOrderBy(sortBy);
    const where = mapTransactionFiltersToWhere(userId, filters);

    try {
      const [data, totalCount] = await prisma.$transaction([
        prisma.transaction.findMany({ where, orderBy, skip, take }),
        prisma.transaction.count({ where }),
      ]);

      const totalPages = fetchAll ? 1 : Math.ceil(totalCount / pageSize);

      return {
        success: true,
        data: {
          data,
          totalCount,
          totalPages,
          page: fetchAll ? 0 : page,
          pageSize: fetchAll ? totalCount : pageSize,
        },
      };
    } catch (error) {
      return { success: false, error: "Internal Server Error" };
    }
  }
);
