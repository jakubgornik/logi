import z from "zod";
import { paginatedQuerySchema } from "@/lib/types/common.types";

export type IContractQuery = z.infer<typeof paginatedQuerySchema>;
