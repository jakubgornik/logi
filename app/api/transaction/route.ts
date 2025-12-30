import { routeGuard } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { baseTransactionSchema } from "@/modules/transaction/transaction-form.validation";
import { NextRequest, NextResponse } from "next/server";

export const PUT = routeGuard(async (request: NextRequest, { user }) => {
  const payload = baseTransactionSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  const { name, customerId, items } = payload.data;

  const validCustomerId =
    customerId && customerId.trim() !== "" ? customerId : null;

  try {
    const transaction = await prisma.transaction.upsert({
      where: {
        sellerId_name: {
          sellerId: user.id,
          name: name,
        },
      },
      update: {
        customerId: validCustomerId,
        items: {
          deleteMany: {},
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      create: {
        sellerId: user.id,
        name,
        customerId: validCustomerId,
        status: "DRAFT",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json({ message: "Saved", data: transaction });
  } catch (error) {
    console.error("Upsert Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
});
