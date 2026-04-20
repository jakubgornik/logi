"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { Customer } from "@/prisma/client/client";
import { Badge } from "@/components/ui/badge";
import { formatAddress } from "@/lib/utils/format-address";

export function useCustomerTableColumns(): ColumnDef<Customer>[] {
  return useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            className="shadow-2xl"
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
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      {
        accessorKey: "customerName",
        header: "Customer Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="hover:underline font-semibold">
              {row.original.customerName}
            </span>
            {row.original.appUserId && (
              <Badge variant="outline" className="text-xs">
                Logi App User
              </Badge>
            )}
          </div>
        ),
      },
      {
        id: "address",
        header: "Address",
        cell: ({ row }) => {
          const address = formatAddress(
            row.original.addressStreet!,
            row.original.addressCity!,
            row.original.addressPostalCode!,
            row.original.addressCountry!,
          );
          return (
            <span
              className="block max-w-[140px] lg:max-w-full truncate"
              title={address}
            >
              {address}
            </span>
          );
        },
      },
    ],
    [],
  );
}
