import z from "zod";
import { isTodayOrFuture } from "./contract-form.utils";

const baseContractSchema = z.object({
  title: z.string().min(1, "Contract title is required"),
  supplierId: z.string().min(1, "Supplier is required"),
});

export const contractFormSchema = baseContractSchema.extend({
  validUntil: z
    .date({
      message: "Valid until date is required",
    })
    .refine(isTodayOrFuture, {
      message: "Valid until date must be today or in the future",
    }),
});

export type ContractFormSchema = z.infer<typeof contractFormSchema>;

export const contractApiSchema = baseContractSchema.extend({
  validUntil: z.coerce
    .date({
      message: "Valid until date is required",
    })
    .refine(isTodayOrFuture, {
      message: "Valid until date must be today or in the future",
    }),
});

export type ContractApiSchema = z.infer<typeof contractApiSchema>;
