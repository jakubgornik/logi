import z from "zod";
import { paginatedQuerySchema } from "@/lib/types/common.types";
import { Contract, Scope } from "@/prisma/client/client";

export type IContractQuery = z.infer<typeof paginatedQuerySchema>;

export type DerivedContractStatus = "ACTIVE" | "EXPIRED";

export type ContractTimeStatus = "expired" | "critical" | "warning" | "good";

export type IContractWithSupplier = Contract & {
  supplier: {
    scopes: Scope[];
  };
};
