import { routeGuard } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/modules/product/product-form.validation";
import { NextRequest, NextResponse } from "next/server";

export const POST = routeGuard(async (request: NextRequest, { user }) => {
  const payload = productSchema.safeParse(await request.json());

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
        { status: 404 }
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
      },
      create: {
        userId: user.id,
        productId: product.id,
        quantity: quantity,
      },
    });

    return NextResponse.json(
      { message: "Inventory updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
});
