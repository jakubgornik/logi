import z from "zod";
import { SupplierFormSchema } from "./supplier-form.validation";
import { paginatedQuerySchema } from "@/lib/types/common.types";

export type ISupplierQuery = z.infer<typeof paginatedQuerySchema>;

export type ISupplierWithId = SupplierFormSchema & { id: string };
