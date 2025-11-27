import { routeGuard } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supplierSchema } from "@/modules/supplier/supplier-form.validation";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  id: string;
}

export const PUT = routeGuard<RouteParams>(
  async (request: NextRequest, { params }) => {
    const { id } = await params;

    const payload = supplierSchema.safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    try {
      const updatedSupplier = await prisma.supplier.update({
        where: { id },
        data: payload.data,
      });

      return NextResponse.json(updatedSupplier, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error updating" }, { status: 500 });
    }
  }
);
