import { z } from "zod";

const isTodayOrFuture = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

export const contractSchema = z.object({
  title: z.string().min(1, "Contract title is required"),
  //   supplierId: z.string().min(1, "Supplier is required"),
  validUntil: z
    .date({
      message: "Valid until date is required",
    })
    .refine(isTodayOrFuture, {
      message: "Valid until date must be today or in the future",
    }),
});

export type ContractFormSchema = z.infer<typeof contractSchema>;

export const createDefaultContractFormData = (): ContractFormSchema => {
  return {
    title: "",
    // supplierId: "",
    validUntil: undefined as unknown as Date,
  };
};
