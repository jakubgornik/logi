import z from "zod";
import { paginatedQuerySchema } from "@/lib/types/common.types";

export type IInventoryQuery = z.infer<typeof paginatedQuerySchema>;
