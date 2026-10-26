"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { Transaction } from "@/prisma/client/client";
import { Badge } from "@/components/ui/badge";

export function useTransactionTableColumns(): ColumnDef<Transaction>[] {
  return useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            className="shadow-2xl"
            disabled={table.options.enableRowSelection === false}
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            className="shadow-2xl"
            disabled={!row.getCanSelect()}
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Transaction Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="hover:underline font-semibold">
              {row.original.name}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          return (
            <Badge
              variant={row.original.status === "DRAFT" ? "outline" : "default"}
              className="text-xs"
            >
              {row.original.status}
            </Badge>
          );
        },
      },
    ],
    [],
  );
}
