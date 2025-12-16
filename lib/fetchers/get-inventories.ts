import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { PaginatedResponse, ServiceResult } from "@/lib/types/common.types";
import { Inventory, Prisma } from "@/prisma/client/client";
import { IInventoryQuery } from "@/modules/inventory/inventory.types";
import { mapInventorySortToOrderBy } from "../utils/mappers/inventory/map-inventory-sort-to-order-by";
import { mapInventoryFiltersToWhere } from "../utils/mappers/inventory/map-inventory-filters-to-where";

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

    const orderBy = mapInventorySortToOrderBy(sortBy);
    const where = mapInventoryFiltersToWhere(userId, filters);

    try {
      const [data, totalCount] = await prisma.$transaction([
        prisma.inventory.findMany({
          where,
          orderBy,
          skip,
          take,
          include: {
            product: true,
          },
        }),
        prisma.inventory.count({
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
