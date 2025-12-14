import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { PaginatedResponse, ServiceResult } from "@/lib/types/common.types";
import { IContractQuery } from "@/modules/contract/contract.types";
import { Contract, Prisma } from "@/prisma/client/client";
import { mapContractSortToOrderBy } from "../utils/mappers/map-contract-sort-to-order-by";
import { mapContractFiltersToWhere } from "../utils/mappers/map-contract-filters-to-where";

type ContractArgs = Partial<IContractQuery> & {
  userId: string;
  fetchAll?: boolean;
};

type ContractWithSupplier = Prisma.ContractGetPayload<{
  include: {
    supplier: {
      select: {
        scopes: true;
      };
    };
  };
}>;

export const getContracts = cache(
  async ({
    userId,
    page = 0,
    pageSize = 10,
    sortBy = [],
    filters = [],
    fetchAll = false,
  }: ContractArgs): Promise<
    ServiceResult<PaginatedResponse<ContractWithSupplier>>
  > => {
    const skip = fetchAll ? undefined : page * pageSize;
    const take = fetchAll ? undefined : pageSize;

    const orderBy = mapContractSortToOrderBy(sortBy);
    const where = mapContractFiltersToWhere(userId, filters);

    try {
      const [data, totalCount] = await prisma.$transaction([
        prisma.contract.findMany({
          where,
          orderBy,
          skip,
          take,
          include: {
            supplier: {
              select: {
                scopes: true,
              },
            },
          },
        }),
        prisma.contract.count({
          where,
        }),
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
