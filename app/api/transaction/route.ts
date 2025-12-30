import { routeGuard } from "@/lib/auth";
import { getTransactions } from "@/lib/fetchers/get-transactions";
import { prisma } from "@/lib/prisma";
import { IdArraySchema, paginatedQuerySchema } from "@/lib/types/common.types";
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
  const result = await getTransactions({
    userId: user.id,
    ...payload.data,
  });

  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data);
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
    await prisma.transaction.deleteMany({
      where: {
        id: { in: payload.data.ids },
        sellerId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: `${payload.data.ids.length} transaction(s) deleted successfully`,
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
