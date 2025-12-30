import { routeGuard } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { baseTransactionSchema } from "@/modules/transaction/transaction-form.validation";
import { NextRequest, NextResponse } from "next/server";

export const POST = routeGuard(async (request: NextRequest, { user }) => {
  const payload = baseTransactionSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  const { name, customerId, items } = payload.data;

  const existingTransaction = await prisma.transaction.findUnique({
    where: { sellerId_name: { sellerId: user.id, name } },
  });

  if (existingTransaction) {
    return NextResponse.json(
      { message: "A transaction with this name already exists." },
      { status: 409 }
    );
  }

  const validCustomerId =
    customerId && customerId.trim() !== "" ? customerId : null;

  try {
    const transaction = await prisma.transaction.create({
      data: {
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

    return NextResponse.json({ message: "Draft Created", data: transaction });
  } catch (error) {
    console.error("Create Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
});
