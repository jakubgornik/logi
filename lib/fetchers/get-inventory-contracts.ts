import { prisma } from "@/lib/prisma";
import type { ServiceResult } from "@/lib/types/common.types";
import type { InventoryContractOption } from "@/modules/inventory/inventory.types";
import { startOfDay } from "date-fns";
import { cache } from "react";

export const getInventoryContracts = cache(
  async (userId: string): Promise<ServiceResult<InventoryContractOption[]>> => {
    try {
      const contracts = await prisma.contract.findMany({
        where: {
          userId,
          supplier: { userId },
          validUntil: { gte: startOfDay(new Date()) },
        },
        select: {
          id: true,
          title: true,
          supplier: { select: { scopes: true } },
        },
      });

      return { success: true, data: contracts };
    } catch {
      return { success: false, error: "Internal Server Error" };
    }
  },
);
