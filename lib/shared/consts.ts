import { Scope } from "@/prisma/client/enums";

export const COOKIE_NAME = "app-session";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  maxAge: 60 * 60 * 24 * 1, // 1 day
  sameSite: "lax" as const,
  path: "/",
};

export const JWT_SIGN_OPTIONS = { expiresIn: "1d" } as const;

export const SCOPES: Record<Scope, string> = {
  [Scope.IT_HARDWARE]: "IT Hardware",
  [Scope.OFFICE_SUPPLIES]: "Office Supplies",
  [Scope.CONSTRUCTION]: "Construction",
};

export const SCOPE_OPTIONS = Object.values(Scope).map((scope) => ({
  label: SCOPES[scope],
  value: scope,
}));

export type ScopeOption = (typeof SCOPE_OPTIONS)[number];

export const PRODUCTS = [
  { name: "Laptop", scope: Scope.IT_HARDWARE },
  { name: "Monitor", scope: Scope.IT_HARDWARE },
  { name: "Keyboard", scope: Scope.IT_HARDWARE },
  { name: "Mouse", scope: Scope.IT_HARDWARE },
  { name: "Docking Station", scope: Scope.IT_HARDWARE },
  { name: "Router", scope: Scope.IT_HARDWARE },
  { name: "Printer", scope: Scope.IT_HARDWARE },
  { name: "Server", scope: Scope.IT_HARDWARE },
  { name: "Headset", scope: Scope.IT_HARDWARE },
  { name: "Webcam", scope: Scope.IT_HARDWARE },

  { name: "Paper A4", scope: Scope.OFFICE_SUPPLIES },
  { name: "Stapler", scope: Scope.OFFICE_SUPPLIES },
  { name: "Pens Pack", scope: Scope.OFFICE_SUPPLIES },
  { name: "Notebooks", scope: Scope.OFFICE_SUPPLIES },
  { name: "Post-it Notes", scope: Scope.OFFICE_SUPPLIES },
  { name: "Folders", scope: Scope.OFFICE_SUPPLIES },
  { name: "Ink Cartridges", scope: Scope.OFFICE_SUPPLIES },
  { name: "Tape Dispenser", scope: Scope.OFFICE_SUPPLIES },
  { name: "Highlighters", scope: Scope.OFFICE_SUPPLIES },
  { name: "Desk Organizer", scope: Scope.OFFICE_SUPPLIES },

  { name: "Cement Bag", scope: Scope.CONSTRUCTION },
  { name: "Bricks Pallet", scope: Scope.CONSTRUCTION },
  { name: "Steel Beams", scope: Scope.CONSTRUCTION },
  { name: "Concrete Blocks", scope: Scope.CONSTRUCTION },
  { name: "Gravel", scope: Scope.CONSTRUCTION },
  { name: "Timber Plank", scope: Scope.CONSTRUCTION },
  { name: "Insulation Sheets", scope: Scope.CONSTRUCTION },
  { name: "Roof Tiles", scope: Scope.CONSTRUCTION },
  { name: "PVC Pipes", scope: Scope.CONSTRUCTION },
  { name: "Paint Bucket", scope: Scope.CONSTRUCTION },
];
