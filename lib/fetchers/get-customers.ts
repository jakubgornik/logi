import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { PaginatedResponse, ServiceResult } from "@/lib/types/common.types";
import { Customer } from "@/prisma/client/client";
import { ICustomerQuery } from "@/modules/customer/customer.types";
import { mapCustomerFiltersToWhere } from "../utils/mappers/customer/map-customer-filters-to-where";
import { mapCustomerSortToOrderBy } from "../utils/mappers/customer/map-customer-sort-to-order-by";

type CustomerArgs = Partial<ICustomerQuery> & {
  userId: string;
  fetchAll?: boolean;
};

export const getCustomers = cache(
  async ({
    userId,
    page = 0,
    pageSize = 10,
    sortBy = [],
    filters = [],
    fetchAll = false,
  }: CustomerArgs): Promise<ServiceResult<PaginatedResponse<Customer>>> => {
    const skip = fetchAll ? undefined : page * pageSize;
    const take = fetchAll ? undefined : pageSize;

    const orderBy = mapCustomerSortToOrderBy(sortBy);
    const where = mapCustomerFiltersToWhere(userId, filters);

    try {
      const [data, totalCount] = await prisma.$transaction([
        prisma.customer.findMany({
          where,
          orderBy,
          skip,
          take,
        }),
        prisma.customer.count({
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
