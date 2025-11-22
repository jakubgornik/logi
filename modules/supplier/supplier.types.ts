import { SupplierFormSchema } from "./supplier-form.validation";

export type SortBy = {
  field: string;
  direction: "asc" | "desc";
};

export type ISupplier = SupplierFormSchema & { id: string };
