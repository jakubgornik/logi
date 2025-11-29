import { mapCountryCodeToName } from "@/modules/supplier/supplier-form.utils";

export const formatSupplierAddress = (
  street: string,
  city: string,
  postalCode: string,
  country: string
): string => {
  const parts = [street, city, postalCode, mapCountryCodeToName(country)];
  return parts.join(", ");
};
