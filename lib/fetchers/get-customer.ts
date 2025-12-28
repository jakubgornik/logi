import { cache } from "react";
import { Customer } from "@/prisma/client/client";
import { prisma } from "../prisma";

export const getCustomer = cache(async (id: string): Promise<Customer> => {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: id,
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  } catch (error) {
    throw new Error("Customer not found");
  }
});
