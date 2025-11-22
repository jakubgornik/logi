"use client";

import { DataTable } from "@/components/data-table";
import {
  useReactTable,
  getCoreRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useSupplierTableColumns } from "./use-supplier-table-columns";
import {
  getSelectedIdsFromRowSelection,
  mapSortingToSortBy,
} from "./supplier-table.utils";
import { ISupplier } from "./supplier.types";

interface SupplierTableProps {
  initialData?: ISupplier[];
}

export function SupplierTable({ initialData }: SupplierTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const selectedIds = getSelectedIdsFromRowSelection(rowSelection);

  const sortBy = mapSortingToSortBy(sorting);

  const columns = useSupplierTableColumns();

  const data = useMemo<ISupplier[]>(
    () =>
      // initialData will be fetched server side for initial render

      initialData ??
      [
        // later replace with client side fetched data
      ],
    [initialData]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    manualSorting: true,
    getRowId: (row) => row.id,
    state: {
      rowSelection,
      sorting,
    },
  });

  return (
    <div className="p-6">
      <DataTable table={table} />
    </div>
  );
}
