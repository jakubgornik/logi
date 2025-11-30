import { Scope } from "@/prisma/client/enums";
import { ISupplierWithId } from "../supplier/supplier.types";
import { ContractFormSchema } from "./contract-form.validation";

export const isTodayOrFuture = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

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
