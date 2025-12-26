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
  .refine(
    (data) => {
      if (data.isAppUser) {
        return !!data.appUserId;
      }
      return true;
    },
    {
      message: "App user ID is required when selecting an app user",
      path: ["appUserId"],
    }
  )
  .refine(
    (data) => {
      if (!data.isAppUser) {
        return !!data.customerName;
      }
      return true;
    },
    {
      message: "Customer name is required",
      path: ["customerName"],
    }
  )
  .refine(
    (data) => {
      if (!data.isAppUser) {
        return !!data.addressCountry;
      }
      return true;
    },
    {
      message: "Country is required",
      path: ["addressCountry"],
    }
  )
  .refine(
    (data) => {
      if (!data.isAppUser) {
        return !!data.addressCity;
      }
      return true;
    },
    {
      message: "City is required",
      path: ["addressCity"],
    }
  )
  .refine(
    (data) => {
      if (!data.isAppUser) {
        return !!data.addressStreet;
      }
      return true;
    },
    {
      message: "Street is required",
      path: ["addressStreet"],
    }
  )
  .refine(
    (data) => {
      if (!data.isAppUser) {
        return !!data.addressPostalCode;
      }
      return true;
    },
    {
      message: "Postal code is required",
      path: ["addressPostalCode"],
    }
  );

export type CustomerFormSchema = z.infer<typeof customerSchema>;
