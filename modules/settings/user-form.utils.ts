import { User } from "@/prisma/client/client";
import { UserFormSchema } from "./user-form.validation";

export const createDefaultUserFormData = (user: User): UserFormSchema => ({
  name: user.name ?? "",
  scopes: user.scopes ?? [],
  isCustomer: user.isCustomer ?? false,
  customerName: user.customerName ?? "",
  addressCountry: user.addressCountry ?? "",
  addressCity: user.addressCity ?? "",
  addressStreet: user.addressStreet ?? "",
  addressPostalCode: user.addressPostalCode ?? "",
});
