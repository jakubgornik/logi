"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { IInventoryWithProduct } from "./inventory.types";

const formatScope = (scope: string) => {
  return scope
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export function useInventoryTableColumns(): ColumnDef<IInventoryWithProduct>[] {
  return useMemo(
    () => [
      {
        accessorKey: "product.name",
        header: "Product",
        id: "productName",
        cell: ({ row }) => {
          const { name, scope } = row.original.product;
          return (
            <div className="flex gap-1.5 items-center ">
              <span className="font-semibold text-base">{name}</span>
              <Badge variant="outline" className="text-xs h-5 px-1.5">
                {formatScope(scope)}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
      },
    ],
    []
  );
}
