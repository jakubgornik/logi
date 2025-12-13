import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { PaginatedResponse, ServiceResult } from "@/lib/types/common.types";
import { IContractQuery } from "@/modules/contract/contract.types";
import { Contract } from "@/prisma/client/client";
import { mapContractSortToOrderBy } from "../utils/mappers/map-contract-sort-to-order-by";
import { mapContractFiltersToWhere } from "../utils/mappers/map-contract-filters-to-where";

type ContractArgs = Partial<IContractQuery> & {
  userId: string;
};

export const getContracts = cache(
  async ({
    userId,
    page = 0,
    pageSize = 10,
    sortBy = [],
    filters = [],
  }: ContractArgs): Promise<ServiceResult<PaginatedResponse<Contract>>> => {
    const skip = page * pageSize;
    const take = pageSize;

    console.log(filters);
    const orderBy = mapContractSortToOrderBy(sortBy);
    const where = mapContractFiltersToWhere(userId, filters);

    try {
      const [data, totalCount] = await prisma.$transaction([
        prisma.contract.findMany({
          where,
          orderBy,
          skip,
          take,
        }),
        prisma.contract.count({
          where,
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        success: true,
        data: {
          data,
          totalCount,
          totalPages,
          page,
          pageSize,
        },
      };
    } catch (error) {
      return { success: false, error: "Internal Server Error" };
    }
  }
);
