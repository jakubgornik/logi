"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Contract } from "@/prisma/client/client";

export function useContractsTableColumns(): ColumnDef<Contract>[] {
  return useMemo(() => [], []);
}
