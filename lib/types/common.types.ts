import z from "zod";

export const IdArraySchema = z.object({
  ids: z.array(z.string()),
});
