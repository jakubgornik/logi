import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { PaginatedResponse, ServiceResult } from "@/lib/types/common.types";
import { Customer } from "@/prisma/client/client";
import { ICustomerQuery } from "@/modules/customer/customer.types";

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

    // todo
    // const orderBy = mapCustomerSortToOrderBy(sortBy);
    // const where = mapCustomerFiltersToWhere(userId, filters);

    try {
      const [data, totalCount] = await prisma.$transaction([
        prisma.customer.findMany({
          where: {
            seller: {
              id: userId,
            },
          },
          orderBy: {
            customerName: "asc",
          },
          skip,
          take,
        }),
        prisma.customer.count({
          where: {
            seller: {
              id: userId,
            },
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
