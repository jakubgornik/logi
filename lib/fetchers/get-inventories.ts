import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { PaginatedResponse, ServiceResult } from "@/lib/types/common.types";
import { Inventory, Prisma } from "@/prisma/client/client";
import { IInventoryQuery } from "@/modules/inventory/inventory.types";

export type InventoryWithProduct = Prisma.InventoryGetPayload<{
  include: {
    product: true;
  };
}>;

type InventoryArgs = Partial<IInventoryQuery> & {
  userId: string;
  fetchAll?: boolean;
};

export const getInventories = cache(
  async ({
    userId,
    page = 0,
    pageSize = 10,
    sortBy = [],
    filters = [],
    fetchAll = false,
  }: InventoryArgs): Promise<
    ServiceResult<PaginatedResponse<InventoryWithProduct>>
  > => {
    const skip = fetchAll ? undefined : page * pageSize;
    const take = fetchAll ? undefined : pageSize;

    // todo: implement sorting and filtering
    // const orderBy = mapContractSortToOrderBy(sortBy);
    // const where = mapContractFiltersToWhere(userId, filters);

    try {
      const [data, totalCount] = await prisma.$transaction([
        prisma.inventory.findMany({
          where: {
            userId: userId,
          },
          orderBy: {
            quantity: "desc",
          },
          skip,
          take,
          include: {
            product: true,
          },
        }),
        prisma.inventory.count({
          where: {
            userId: userId,
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
