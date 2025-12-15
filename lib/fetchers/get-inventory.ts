import { cache } from "react";
import { Inventory } from "@/prisma/client/client";
import { prisma } from "../prisma";

export const getInventory = cache(async (id: string): Promise<Inventory> => {
  try {
    const inventory = await prisma.inventory.findUnique({
      where: {
        id: id,
      },
    });

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    return inventory;
  } catch (error) {
    throw new Error("Inventory not found");
  }
});
