import { SupplierFormSchema } from "./supplier-form.validation";
import { countries as countryData } from "countries-list";

export const createDefaultSupplierFormData = (
  data?: SupplierFormSchema
): SupplierFormSchema => ({
  name: data?.name || "",
  phone: data?.phone || "",
  email: data?.email || "",
  addressCountry: data?.addressCountry || "",
  addressCity: data?.addressCity || "",
  addressStreet: data?.addressStreet || "",
  addressPostalCode: data?.addressPostalCode || "",
});

export function getCountryFlag(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export const countryOptions = Object.entries(countryData)
  .map(([code, country]) => ({
    value: code,
    label: country.name,
    icon: <span className="text-lg leading-none">{getCountryFlag(code)}</span>,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));
