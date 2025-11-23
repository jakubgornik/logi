import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { mapSupplierSortToOrderBy } from "../utils/map-supplier-sort-to-order-by";
import { mapSupplierFiltersToWhere } from "../utils/map-supplier-filters-to-where";
import { ISupplierQuery } from "@/modules/supplier/supplier.types";

export const getSuppliers = cache(
  async ({
    page = 0,
    pageSize = 10,
    sortBy = [],
    filters = [],
  }: Partial<ISupplierQuery>) => {
    const skip = page * pageSize;
    const take = pageSize;
    const orderBy = mapSupplierSortToOrderBy(sortBy);
    const where = mapSupplierFiltersToWhere(filters);

    try {
      const [data, totalCount] = await prisma.$transaction([
        prisma.supplier.findMany({
          where,
          orderBy,
          skip,
          take,
        }),
        prisma.supplier.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        data,
        page,
        pageSize,
        totalCount,
        totalPages,
        success: true,
      };
    } catch (error) {
      return { success: false, error: "Internal Server Error" };
    }
  }
);
