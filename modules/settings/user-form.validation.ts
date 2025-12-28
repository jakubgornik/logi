import { Scope } from "@/prisma/client/enums";
import { z } from "zod";

export const userSchema = z
  .object({
    name: z.string().min(1, "User name is required"),
    scopes: z.array(z.enum(Scope)).min(1, "At least one scope is required"),
    isCustomer: z.boolean(),
    customerName: z.string().optional(),
    addressCountry: z.string().optional(),
    addressCity: z.string().optional(),
    addressStreet: z.string().optional(),
    addressPostalCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isCustomer) {
      if (!data.customerName) {
        ctx.addIssue({
          code: "custom",
          message: "Business name is required",
          path: ["customerName"],
        });
      }
      if (!data.addressCountry) {
        ctx.addIssue({
          code: "custom",
          message: "Country is required",
          path: ["addressCountry"],
        });
      }
      if (!data.addressCity) {
        ctx.addIssue({
          code: "custom",
          message: "City is required",
          path: ["addressCity"],
        });
      }
      if (!data.addressStreet) {
        ctx.addIssue({
          code: "custom",
          message: "Street is required",
          path: ["addressStreet"],
        });
      }
      if (!data.addressPostalCode) {
        ctx.addIssue({
          code: "custom",
          message: "Postal code is required",
          path: ["addressPostalCode"],
        });
      }
    }
  });

export type UserFormSchema = z.infer<typeof userSchema>;
