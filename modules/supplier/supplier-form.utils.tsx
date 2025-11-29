import { SupplierFormSchema } from "./supplier-form.validation";
import { countries } from "countries-list";

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
  scopes: data?.scopes || [],
});

export function getCountryFlag(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export const countryOptions = Object.entries(countries)
  .map(([code, country]) => ({
    value: code,
    label: country.name,
    icon: <span className="text-lg leading-none">{getCountryFlag(code)}</span>,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const mapCountryCodeToName = (countryCode: string) => {
  const country = countries[countryCode as keyof typeof countries];
  return country.name;
};
