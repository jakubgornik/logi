import { User } from "@/prisma/client/client";

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
