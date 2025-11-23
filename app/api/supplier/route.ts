import { NextRequest, NextResponse } from "next/server";
import { routeGuard } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supplierSchema } from "@/modules/supplier/supplier-form.validation";
import { IdArraySchema } from "@/lib/types/common.types";
import { supplierQuerySchema } from "@/modules/supplier/supplier.types";
import { mapSupplierSortToOrderBy } from "@/lib/utils/map-supplier-sort-to-order-by";
import { mapSupplierFiltersToWhere } from "@/lib/utils/map-supplier-filters-to-where";

export const POST = routeGuard(async (request: NextRequest) => {
  const payload = supplierSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      {
        message: "Invalid data",
      },
      { status: 400 }
    );
  }

  try {
    await prisma.supplier.create({
      data: {
        ...payload.data,
      },
    });

    return NextResponse.json(
      { message: "Supplier created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
});

export const DELETE = routeGuard(async (request: NextRequest) => {
  const payload = IdArraySchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json(
      {
        message: "Invalid data",
      },
      { status: 400 }
    );
  }

  try {
    await prisma.supplier.deleteMany({
      where: {
        id: { in: payload.data.ids },
      },
    });

    return NextResponse.json(
      {
        message: `${payload.data.ids.length} supplier(s) deleted successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
});

export const GET = routeGuard(async (request: NextRequest) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const payload = supplierQuerySchema.safeParse(searchParams);

  if (!payload.success) {
    return NextResponse.json(
      {
        message: "Invalid query parameters",
      },
      { status: 400 }
    );
  }

  const { page, pageSize, sortBy, filters } = payload.data;
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

    return NextResponse.json({
      data,
      page,
      pageSize,
      totalCount,
      totalPages,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
});
