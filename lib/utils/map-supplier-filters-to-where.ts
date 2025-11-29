import { Prisma } from "@/prisma/client/client";
import { FiltersType } from "../types/common.types";

export const mapSupplierFiltersToWhere = (
  userId: string,
  filters?: FiltersType[]
): Prisma.SupplierWhereInput => {
  const where: Prisma.SupplierWhereInput = {};
  const and: Prisma.SupplierWhereInput[] = [];

  if (filters && filters.length > 0) {
    filters.forEach((filter) => {
      const { column, value } = filter;

      switch (column) {
        case "name":
          and.push({
            name: { contains: value, mode: "insensitive" },
          });
          break;
        case "email":
          and.push({
            email: { contains: value, mode: "insensitive" },
          });
          break;
        case "phone":
          and.push({
            phone: { contains: value, mode: "insensitive" },
          });
          break;
        case "address":
          and.push({
            OR: [
              {
                addressStreet: {
                  contains: value,
                  mode: "insensitive",
                },
              },
              {
                addressCity: { contains: value, mode: "insensitive" },
              },
              {
                addressPostalCode: {
                  contains: value,
                  mode: "insensitive",
                },
              },
              {
                addressCountry: {
                  contains: value,
                  mode: "insensitive",
                },
              },
            ],
          });
          break;
      }
    });
  }

  if (and.length > 0) {
    where.AND = and;
  }

  return {
    ...where,
    userId: userId,
  };
};
