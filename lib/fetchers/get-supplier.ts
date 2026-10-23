import { cache } from "react";
import { Supplier } from "@/prisma/client/client";
import { prisma } from "../prisma";
import { getCurrentUser } from "./get-current-user";
import { redirect } from "next/navigation";
import { ROUTES } from "../routes";

export const getSupplier = cache(
  async (id: string): Promise<Supplier | null> => {
    const user = await getCurrentUser();

    if (!user) {
      redirect(ROUTES.SIGN_IN);
    }

    return prisma.supplier.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
  }
);
