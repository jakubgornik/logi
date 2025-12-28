import z from "zod";

export const customerSchema = z
  .object({
    isAppUser: z.boolean(),
    appUserId: z.string().optional(),
    customerName: z.string().optional(),
    addressCountry: z.string().optional(),
    addressCity: z.string().optional(),
    addressStreet: z.string().optional(),
    addressPostalCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isAppUser) {
      if (!data.appUserId) {
        ctx.addIssue({
          code: "custom",
          message: "App user ID is required when selecting an app user",
          path: ["appUserId"],
        });
      }
    } else {
      if (!data.customerName) {
        ctx.addIssue({
          code: "custom",
          message: "Customer name is required",
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

export type CustomerFormSchema = z.infer<typeof customerSchema>;
