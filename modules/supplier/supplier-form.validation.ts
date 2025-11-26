import { Scope } from "@/prisma/client/enums";
import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.email().min(1, "Email is required"),
  addressCountry: z.string().min(1, "Country is required"),
  addressCity: z.string().min(1, "City is required"),
  addressStreet: z.string().min(1, "Street address is required"),
  addressPostalCode: z.string().min(1, "Postal code is required"),
  scopes: z.array(z.enum(Scope)).min(1, "At least one scope is required"),
});

export type SupplierFormSchema = z.infer<typeof supplierSchema>;
