import { Scope } from "@/prisma/client/enums";
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "User name is required"),
  scopes: z.array(z.enum(Scope)).min(1, "At least one scope is required"),
});

export type UserFormSchema = z.infer<typeof userSchema>;
