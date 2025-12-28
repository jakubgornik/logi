import { User } from "@/prisma/client/client";
import { paginatedQuerySchema } from "@/lib/types/common.types";
import z from "zod";

export type ICustomerQuery = z.infer<typeof paginatedQuerySchema>;

export type AppUserSearchResult = Pick<
  User,
  | "id"
  | "email"
  | "customerName"
  | "addressCountry"
  | "addressCity"
  | "addressStreet"
  | "addressPostalCode"
>;
