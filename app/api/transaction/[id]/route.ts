import { routeGuard } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { baseTransactionSchema } from "@/modules/transaction/transaction-form.validation";
import { NotificationType, TransactionStatus } from "@/prisma/client/enums";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = baseTransactionSchema.extend({
  status: z
    .enum([TransactionStatus.DRAFT, TransactionStatus.CONFIRMED])
    .optional(),
});

interface RouteParams {
  id: string;
}

class InsufficientStockError extends Error {
  constructor(productId: string) {
    super(`Insufficient stock for product ID: ${productId}`);
    this.name = "InsufficientStockError";
  }
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
        { status: 404 },
      );
    }

    const validCustomerId =
      customerId && customerId.trim() !== "" ? customerId : null;

    if (status === TransactionStatus.CONFIRMED && !validCustomerId) {
      return NextResponse.json(
        { message: "A Customer must be selected to confirm the transaction." },
        { status: 400 },
      );
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        const customer = validCustomerId
          ? await tx.customer.findUnique({
              where: { id: validCustomerId, sellerId: user.id },
              select: { appUserId: true },
            })
          : null;

        if (validCustomerId && !customer) {
          return "CUSTOMER_NOT_FOUND";
        }

        const claimedTransaction = await tx.transaction.updateMany({
          where: {
            id: transactionId,
            sellerId: user.id,
            status: TransactionStatus.DRAFT,
          },
          data: { status: status ?? TransactionStatus.DRAFT },
        });

        if (claimedTransaction.count === 0) {
          return "TRANSACTION_CONFLICT";
        }

        if (status === TransactionStatus.CONFIRMED) {
          await tx.transaction.update({
            where: { id: transactionId },
            data: {
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

          const linkedBuyerUserId = customer?.appUserId ?? null;
          const transferItems = [...items].sort((a, b) =>
            a.productId.localeCompare(b.productId),
          );

          for (const item of transferItems) {
            const deductedStock = await tx.inventory.updateMany({
              where: {
                userId: user.id,
                productId: item.productId,
                quantity: { gte: item.quantity },
              },
              data: { quantity: { decrement: item.quantity } },
            });

            if (deductedStock.count === 0) {
              throw new InsufficientStockError(item.productId);
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
          await tx.notification.create({
            data: {
              userId: user.id,
              type: NotificationType.TRANSACTION_CONFIRMED,
              transactionId: transactionId,
            },
          });
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
              notifications: {
                create: {
                  userId: user.id,
                  type: NotificationType.TRANSACTION_UPDATED,
                },
              },
            },
          });
        }

        return "UPDATED";
      });

      if (result === "CUSTOMER_NOT_FOUND") {
        return NextResponse.json(
          { message: "Customer not found" },
          { status: 404 },
        );
      }

      if (result === "TRANSACTION_CONFLICT") {
        return NextResponse.json(
          {
            message: "Transaction is no longer a draft and cannot be updated.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json({
        message:
          status === TransactionStatus.CONFIRMED
            ? "Transaction Confirmed"
            : "Draft Updated",
      });
    } catch (error) {
      if (error instanceof InsufficientStockError) {
        return NextResponse.json({ message: error.message }, { status: 409 });
      }

      console.error("Update Error:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 },
      );
    }
  },
);
