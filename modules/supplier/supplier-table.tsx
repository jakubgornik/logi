"use client";

import { DataTable } from "@/components/data-table";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useSupplierTableColumns } from "./use-supplier-table-columns";
import { SupplierFormSchema } from "./supplier-form.validation";

export type SupplierWithId = SupplierFormSchema & { id: string };

export function SupplierTable() {
  const [rowSelection, setRowSelection] = useState({});
  const columns = useSupplierTableColumns();

  const data = useMemo<SupplierWithId[]>(
    () => [
      {
        id: "1",
        name: "ABC Logistics Sp. z o.o.",
        phone: "+48 22 123 4567",
        email: "kontakt@abclogistics.pl",
        addressCountry: "PL",
        addressCity: "Warszawa",
        addressStreet: "ul. Marszałkowska 123",
        addressPostalCode: "00-001",
      },
      {
        id: "2",
        name: "ABC Logistics Sp. z o.o.",
        phone: "+48 22 123 4567",
        email: "kontakt@abclogistics.pl",
        addressCountry: "PL",
        addressCity: "Warszawa",
        addressStreet: "ul. Marszałkowska 123",
        addressPostalCode: "00-001",
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    state: {
      rowSelection,
    },
  });

  const selectedIds = Object.keys(rowSelection);
  console.log(selectedIds);

  return (
    <div className="p-6">
      <DataTable table={table} />
    </div>
  );
}
