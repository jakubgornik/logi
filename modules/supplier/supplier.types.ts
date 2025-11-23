import z from "zod";
import { SupplierFormSchema } from "./supplier-form.validation";
import { jsonParse } from "@/lib/utils/json-parse";
import { filterSchema, sortBySchema } from "@/lib/types/common.types";

export type ISupplier = SupplierFormSchema & { id: string };

export const supplierQuerySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).default(10),
  search: z.string().optional(),
  sortBy: jsonParse(z.array(sortBySchema)).optional(),
  filters: jsonParse(z.array(filterSchema)).optional(),
});

export type ISupplierQuery = z.infer<typeof supplierQuerySchema>;
