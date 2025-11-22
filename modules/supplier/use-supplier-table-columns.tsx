"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { SupplierWithId } from "./supplier-table";

const formatSupplierAddress = (
  street?: string,
  city?: string,
  postalCode?: string,
  country?: string
): string => {
  return [street, city, postalCode, country].join(", ");
};

export function useSupplierTableColumns(): ColumnDef<SupplierWithId>[] {
  return useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ table }) => (
          <div className="flex items-center gap-3">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
            <span>Supplier name</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        id: "address",
        header: "Address",
        accessorFn: (row) =>
          formatSupplierAddress(
            row.addressStreet,
            row.addressCity,
            row.addressPostalCode,
            row.addressCountry
          ),
      },
    ],
    []
  );
}
