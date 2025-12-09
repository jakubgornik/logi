"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { formatSupplierAddress } from "@/lib/utils/format-supplier-address";
import { Supplier } from "@/prisma/client/client";

export function useSupplierTableColumns(): ColumnDef<Supplier>[] {
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
            className="hover:underline font-semibold"
            href={`${ROUTES.SUPPLIER}/${row.original.id}`}
            onClick={(e) => e.stopPropagation()}
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
        cell: ({ row }) => {
          const address = formatSupplierAddress(
            row.original.addressStreet,
            row.original.addressCity,
            row.original.addressPostalCode,
            row.original.addressCountry
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
    []
  );
}
