import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/client/client";

export type TransactionWithItems = Prisma.TransactionGetPayload<{
  include: { items: true };
}>;

export const getTransaction = cache(
  async (id: string): Promise<TransactionWithItems | null> => {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });
      return transaction;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      return null;
    }
  }
);
