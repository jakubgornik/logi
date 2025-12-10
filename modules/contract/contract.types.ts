import z from "zod";
import { paginatedQuerySchema } from "@/lib/types/common.types";

export type IContractQuery = z.infer<typeof paginatedQuerySchema>;

export type DerivedContractStatus = "ACTIVE" | "EXPIRED";

export type ContractTimeStatus = "expired" | "critical" | "warning" | "good";
