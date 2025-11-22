"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        id: "select",
        header: ({ table }) => (
          <Checkbox
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
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Supplier Name",
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
