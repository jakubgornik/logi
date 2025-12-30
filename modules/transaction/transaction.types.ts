import { paginatedQuerySchema } from "@/lib/types/common.types";
import z from "zod";

export type ITransactionQuery = z.infer<typeof paginatedQuerySchema>;
