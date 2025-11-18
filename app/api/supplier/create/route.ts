import { NextRequest, NextResponse } from "next/server";
import { routeGuard } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supplierSchema } from "@/modules/supplier/supplier-form.validation";

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
