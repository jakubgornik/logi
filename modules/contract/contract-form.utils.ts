import { Scope } from "@/prisma/client/enums";
import { z } from "zod";
import { ISupplierWithId } from "../supplier/supplier.types";

const isTodayOrFuture = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

export const contractSchema = z.object({
  title: z.string().min(1, "Contract title is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  validUntil: z
    .date({
      message: "Valid until date is required",
    })
    .refine(isTodayOrFuture, {
      message: "Valid until date must be today or in the future",
    }),
});

export type ContractFormSchema = z.infer<typeof contractSchema>;

export const createDefaultContractFormData = (): ContractFormSchema => {
  return {
    title: "",
    supplierId: "",
    validUntil: undefined as unknown as Date,
  };
};

export const filterSuppliers = (
  suppliers: ISupplierWithId[],
  search: string,
  selectedScopes: Scope[]
): ISupplierWithId[] => {
  const normalizedSearch = search.toLowerCase().trim();

  return suppliers.filter((supplier) => {
    const matchesSearch =
      !normalizedSearch ||
      supplier.name.toLowerCase().includes(normalizedSearch) ||
      supplier.email.toLowerCase().includes(normalizedSearch) ||
      supplier.addressCity.toLowerCase().includes(normalizedSearch);

    const matchesScope =
      selectedScopes.length === 0 ||
      supplier.scopes.some((scope) => selectedScopes.includes(scope));

    return matchesSearch && matchesScope;
  });
};
