import { cache } from "react";
import { Transaction } from "@/prisma/client/client";
import { prisma } from "../prisma";

export const getTransaction = cache(
  async (id: string): Promise<Transaction> => {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: {
          id: id,
        },
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      return transaction;
    } catch (error) {
      throw new Error("Transaction not found");
    }
  }
);
