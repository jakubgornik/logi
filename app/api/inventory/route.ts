import { routeGuard } from "@/lib/auth";
import { getInventories } from "@/lib/fetchers/get-inventories";
import { prisma } from "@/lib/prisma";
import { paginatedQuerySchema } from "@/lib/types/common.types";
import { inventorySchema } from "@/modules/inventory/inventory-form.validation";
import { NotificationType } from "@/prisma/client/enums";
import { NextRequest, NextResponse } from "next/server";

export const POST = routeGuard(async (request: NextRequest, { user }) => {
  const payload = inventorySchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  const { name, scope, quantity } = payload.data;

  try {
    const product = await prisma.product.findFirst({
      where: {
        name: name,
        scope: scope,
      },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: `Product '${name}' not found for scope ${scope}`,
        },
        { status: 404 },
      );
    }

    await prisma.inventory.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId: product.id,
        },
      },
      update: {
        quantity: { increment: quantity },
        notifications: {
          create: {
            userId: user.id,
            type: NotificationType.INVENTORY_UPDATED,
          },
        },
      },
      create: {
        userId: user.id,
        productId: product.id,
        quantity: quantity,
        notifications: {
          create: {
            userId: user.id,
            type: NotificationType.INVENTORY_ADDED,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Inventory updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Inventory Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
});

export const GET = routeGuard(async (_, { user, searchParams }) => {
  const payload = paginatedQuerySchema.safeParse(searchParams);

  if (!payload.success) {
    return NextResponse.json(
      { message: "Invalid query parameters" },
      { status: 400 },
    );
  }

  const result = await getInventories({
    userId: user.id,
    ...payload.data,
  });

  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data);
});
