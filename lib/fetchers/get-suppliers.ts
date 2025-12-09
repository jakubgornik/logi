import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { mapSupplierSortToOrderBy } from "../utils/map-supplier-sort-to-order-by";
import { mapSupplierFiltersToWhere } from "../utils/map-supplier-filters-to-where";
import { ISupplierQuery } from "@/modules/supplier/supplier.types";
import { PaginatedResponse, ServiceResult } from "@/lib/types/common.types";
import { Supplier } from "@/prisma/client/client";

type SupplierArgs = Partial<ISupplierQuery> & {
  userId: string;
  fetchAll?: boolean;
};

export const getSuppliers = cache(
  async ({
    userId,
    page = 0,
    pageSize = 10,
    sortBy = [],
    filters = [],
    fetchAll = false,
  }: SupplierArgs): Promise<ServiceResult<PaginatedResponse<Supplier>>> => {
    const skip = fetchAll ? undefined : page * pageSize;
    const take = fetchAll ? undefined : pageSize;

    const orderBy = mapSupplierSortToOrderBy(sortBy);
    const where = mapSupplierFiltersToWhere(userId, filters);

    try {
      const [data, totalCount] = await prisma.$transaction([
        prisma.supplier.findMany({ where, orderBy, skip, take }),
        prisma.supplier.count({ where }),
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
