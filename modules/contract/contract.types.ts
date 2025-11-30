import z from "zod";
import { paginatedQuerySchema } from "@/lib/types/common.types";
import { ContractFormSchema } from "./contract-form.validation";

export type IContractQuery = z.infer<typeof paginatedQuerySchema>;

export type IContractWithId = ContractFormSchema & { id: string };
