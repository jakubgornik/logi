import { routeGuard } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { baseTransactionSchema } from "@/modules/transaction/transaction-form.validation";
import { TransactionStatus } from "@/prisma/client/enums";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = baseTransactionSchema.extend({
  status: z.enum(TransactionStatus).optional(),
});

interface RouteParams {
  id: string;
}

export const PUT = routeGuard<RouteParams>(
  async (request: NextRequest, { user, params }) => {
    const { id: transactionId } = params;

    const payload = updateSchema.safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const { name, customerId, items, status } = payload.data;

    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existingTransaction || existingTransaction.sellerId !== user.id) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    if (existingTransaction.status === TransactionStatus.CONFIRMED) {
      return NextResponse.json(
        { message: "Cannot edit a confirmed transaction." },
        { status: 403 }
      );
    }

    const validCustomerId =
      customerId && customerId.trim() !== "" ? customerId : null;

    if (status === TransactionStatus.CONFIRMED && !validCustomerId) {
      return NextResponse.json(
        { message: "A Customer must be selected to confirm the transaction." },
        { status: 400 }
      );
    }

    try {
      await prisma.$transaction(async (tx) => {
        if (status === TransactionStatus.CONFIRMED) {
          await tx.transaction.update({
            where: { id: transactionId },
            data: {
              status: TransactionStatus.CONFIRMED,
              customerId: validCustomerId,
              items: {
                deleteMany: {},
                create: items.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                })),
              },
            },
          });

          let linkedBuyerUserId: string | null = null;
          if (validCustomerId) {
            const customerRecord = await tx.customer.findUnique({
              where: { id: validCustomerId },
              select: { appUserId: true },
            });
            linkedBuyerUserId = customerRecord?.appUserId || null;
          }

          for (const item of items) {
            const sellerInventory = await tx.inventory.findUnique({
              where: {
                userId_productId: {
                  userId: user.id,
                  productId: item.productId,
                },
              },
            });

            if (!sellerInventory || sellerInventory.quantity < item.quantity) {
              throw new Error(
                `Insufficient stock for product ID: ${item.productId}`
              );
            }

            const remainingQuantity = sellerInventory.quantity - item.quantity;

            if (remainingQuantity === 0) {
              await tx.inventory.delete({ where: { id: sellerInventory.id } });
            } else {
              await tx.inventory.update({
                where: { id: sellerInventory.id },
                data: { quantity: remainingQuantity },
              });
            }

            if (linkedBuyerUserId) {
              await tx.inventory.upsert({
                where: {
                  userId_productId: {
                    userId: linkedBuyerUserId,
                    productId: item.productId,
                  },
                },
                update: { quantity: { increment: item.quantity } },
                create: {
                  userId: linkedBuyerUserId,
                  productId: item.productId,
                  quantity: item.quantity,
                },
              });
            }
          }
        } else {
          if (name !== existingTransaction.name) {
            const nameCheck = await tx.transaction.findUnique({
              where: { sellerId_name: { sellerId: user.id, name } },
            });
            if (nameCheck) throw new Error("Name already taken");
          }

          await tx.transaction.update({
            where: { id: transactionId },
            data: {
              name,
              customerId: validCustomerId,
              items: {
                deleteMany: {},
                create: items.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                })),
              },
            },
          });
        }
      });

      return NextResponse.json({
        message:
          status === TransactionStatus.CONFIRMED
            ? "Transaction Confirmed"
            : "Draft Updated",
      });
    } catch (error) {
      console.error("Update Error:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
);
