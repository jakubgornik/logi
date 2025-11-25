import { cache } from "react";
import { ISupplier } from "@/modules/supplier/supplier.types";
import { Supplier } from "@/prisma/client/client";
import { prisma } from "../prisma";

export const getSupplier = cache(async (id: string): Promise<Supplier> => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: {
        id: id,
      },
    });

    if (!supplier) {
      throw new Error("Supplier not found");
    }

    return supplier;
  } catch (error) {
    throw new Error("Supplier not found");
  }
});
