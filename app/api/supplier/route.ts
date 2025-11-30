import { NextRequest, NextResponse } from "next/server";
import { routeGuard } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supplierSchema } from "@/modules/supplier/supplier-form.validation";
import { IdArraySchema, paginatedQuerySchema } from "@/lib/types/common.types";
import { getSuppliers } from "@/lib/fetchers/get-suppliers";

export const POST = routeGuard(async (request: NextRequest, { user }) => {
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
        userId: user.id,
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

export const DELETE = routeGuard(async (request: NextRequest, { user }) => {
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
        userId: user.id,
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

export const GET = routeGuard(async (_, { user, searchParams }) => {
  const payload = paginatedQuerySchema.safeParse(searchParams);

  if (!payload.success) {
    return NextResponse.json(
      {
        message: "Invalid query parameters",
      },
      { status: 400 }
    );
  }
  const result = await getSuppliers({
    userId: user.id,
    ...payload.data,
  });

  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data);
});
