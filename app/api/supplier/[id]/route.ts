import { routeGuard } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supplierSchema } from "@/modules/supplier/supplier-form.validation";
import { NotificationType } from "@/prisma/client/enums";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  id: string;
}

export const PUT = routeGuard<RouteParams>(
  async (request: NextRequest, { user, params }) => {
    const { id } = params;

    const payload = supplierSchema.safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    try {
      const updatedSupplier = await prisma.supplier.update({
        where: { id, userId: user.id },
        data: {
          ...payload.data,
          notifications: {
            create: {
              userId: user.id,
              type: NotificationType.SUPPLIER_UPDATED,
            },
          },
        },
      });

      return NextResponse.json(updatedSupplier, { status: 200 });
    } catch (error) {
      console.error("Update error:", error);
      return NextResponse.json({ message: "Error updating" }, { status: 500 });
    }
  },
);
