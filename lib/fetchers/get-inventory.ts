import { cache } from "react";
import { prisma } from "../prisma";
import { InventoryWithProduct } from "./get-inventories";

export const getInventory = cache(
  async (id: string): Promise<InventoryWithProduct> => {
    try {
      const inventory = await prisma.inventory.findUnique({
        where: {
          id: id,
        },
        include: {
          product: true,
        },
      });

      if (!inventory) {
        throw new Error("Inventory not found");
      }

      return inventory;
    } catch (error) {
      throw new Error("Inventory not found");
    }
  }
);
