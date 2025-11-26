"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ISupplier } from "./supplier.types";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const formatSupplierAddress = (
  street?: string,
  city?: string,
  postalCode?: string,
  country?: string
): string => {
  return [street, city, postalCode, country].join(", ");
};

export function useSupplierTableColumns(): ColumnDef<ISupplier>[] {
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
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <Link
            className="hover:underline"
            href={`${ROUTES.SUPPLIER}/${row.original.id}`}
          >
            {row.original.name}
          </Link>
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
