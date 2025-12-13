"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Contract } from "@/prisma/client/client";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  contractStatusVariants,
  getContractTimeStatus,
  getDerivedContractStatus,
  timeRemainingVariants,
} from "./contract-table.utils";

interface ContractStatusCellProps {
  validUntil: Date;
}

export const ContractStatusCell = ({ validUntil }: ContractStatusCellProps) => {
  const status = getDerivedContractStatus(validUntil);
  const label = status === "ACTIVE" ? "Active" : "Expired";

  return (
    <Badge variant="outline" className={cn(contractStatusVariants({ status }))}>
      {label}
    </Badge>
  );
};

interface ContractTimeRemainingCellProps {
  validUntil: Date;
}

export const ContractTimeRemainingCell = ({
  validUntil,
}: ContractTimeRemainingCellProps) => {
  const { label, status } = getContractTimeStatus(validUntil);

  return <span className={cn(timeRemainingVariants({ status }))}>{label}</span>;
};

export function useContractsTableColumns(): ColumnDef<Contract>[] {
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
        accessorKey: "title",
        header: "Contract Title",
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.title}</span>
        ),
      },
      {
        accessorKey: "validUntil",
        header: "Time Remaining",
        cell: ({ row }) => (
          <ContractTimeRemainingCell validUntil={row.original.validUntil} />
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <ContractStatusCell validUntil={row.original.validUntil} />
        ),
      },
    ],
    []
  );
}
