import { cache } from "react";
import { Contract } from "@/prisma/client/client";
import { prisma } from "../prisma";

export const getContract = cache(async (id: string): Promise<Contract> => {
  try {
    const contract = await prisma.contract.findUnique({
      where: {
        id: id,
      },
    });

    if (!contract) {
      throw new Error("Contract not found");
    }

    return contract;
  } catch (error) {
    throw new Error("Contract not found");
  }
});
