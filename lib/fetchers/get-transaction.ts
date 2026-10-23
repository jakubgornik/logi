import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/client/client";
import { getCurrentUser } from "./get-current-user";
import { redirect } from "next/navigation";
import { ROUTES } from "../routes";

export type TransactionWithItems = Prisma.TransactionGetPayload<{
  include: { items: true };
}>;

export const getTransaction = cache(
  async (id: string): Promise<TransactionWithItems | null> => {
    const user = await getCurrentUser();

    if (!user) {
      redirect(ROUTES.SIGN_IN);
    }

    return prisma.transaction.findUnique({
      where: { id, sellerId: user.id },
      include: {
        items: true,
      },
    });
  }
);
