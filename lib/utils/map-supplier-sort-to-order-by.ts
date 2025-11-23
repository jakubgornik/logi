import { Prisma } from "@/prisma/client/client";
import { SortBy } from "@/lib/types/common.types";

export const mapSupplierSortToOrderBy = (
  sortBy?: SortBy[]
): Prisma.SupplierOrderByWithRelationInput[] => {
  if (!sortBy || sortBy.length === 0) {
    return [{ name: "desc" }];
  }

  return sortBy.map((sort) => {
    switch (sort.field) {
      case "name":
        return { name: sort.direction };
      case "email":
        return { email: sort.direction };
      case "phone":
        return { phone: sort.direction };
      case "addressCity":
        return { addressCity: sort.direction };
      case "addressCountry":
        return { addressCountry: sort.direction };
      default:
        return { name: sort.direction };
    }
  });
};
