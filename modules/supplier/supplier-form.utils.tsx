import { SupplierFormSchema } from "./supplier-form.validation";
import { countries as countryData } from "countries-list";
import { CircleFlag } from "react-circle-flags";

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

export const countryOptions = Object.entries(countryData)
  .map(([code, country]) => ({
    value: code,
    label: country.name,
    icon: <CircleFlag countryCode={code.toLowerCase()} />,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));
