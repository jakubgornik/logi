import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { PaginatedResponse, ServiceResult } from "@/lib/types/common.types";
import {
  IContractQuery,
  IContractWithId,
} from "@/modules/contract/contract.types";

type ContractArgs = Partial<IContractQuery> & {
  userId: string;
  fetchAll?: boolean;
};

export const getContracts = cache(
  async ({
    userId,
    page = 0,
    pageSize = 10,
    sortBy = [],
    filters = [],
    fetchAll = false,
  }: ContractArgs): Promise<
    ServiceResult<PaginatedResponse<IContractWithId>>
  > => {
    const skip = page * pageSize;
    const take = pageSize;

    // todo refactor
    // filters
    // sort
    try {
      const [data, totalCount] = await prisma.$transaction([
        prisma.contract.findMany({
          where: {
            userId,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take,
        }),
        prisma.contract.count({
          where: {
            userId,
          },
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
