import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { mapSupplierSortToOrderBy } from "../utils/map-supplier-sort-to-order-by";
import { mapSupplierFiltersToWhere } from "../utils/map-supplier-filters-to-where";
import { ISupplier, ISupplierQuery } from "@/modules/supplier/supplier.types";
import { PaginatedResponse, ServiceResult } from "@/lib/types/common.types";

export const getSuppliers = cache(
  async ({
    page = 0,
    pageSize = 10,
    sortBy = [],
    filters = [],
  }: Partial<ISupplierQuery>): Promise<
    ServiceResult<PaginatedResponse<ISupplier>>
  > => {
    const skip = page * pageSize;
    const take = pageSize;
    const orderBy = mapSupplierSortToOrderBy(sortBy);
    const where = mapSupplierFiltersToWhere(filters);

    try {
      const [data, totalCount] = await prisma.$transaction([
        prisma.supplier.findMany({ where, orderBy, skip, take }),
        prisma.supplier.count({ where }),
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
