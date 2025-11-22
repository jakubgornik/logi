"use client";

import { DataTable } from "@/components/data-table";
import {
  useReactTable,
  getCoreRowModel,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useSupplierTableColumns } from "./use-supplier-table-columns";
import {
  getSelectedIdsFromRowSelection,
  mapSortingToSortBy,
} from "./supplier-table.utils";
import { ISupplier } from "./supplier.types";
import { TableToolbar } from "@/components/filters/table-toolbar";
import { FilterState } from "@/components/filters/filters.types";
import Pagination from "@/components/pagination/pagination";

interface SupplierTableProps {
  initialData?: ISupplier[];
}

export function SupplierTable({ initialData }: SupplierTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    filters: [],
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const selectedIds = getSelectedIdsFromRowSelection(rowSelection);

  const sortBy = mapSortingToSortBy(sorting);

  const columns = useSupplierTableColumns();

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // TODO
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
    onPaginationChange: setPagination,
    manualPagination: true,
    getRowId: (row) => row.id,
    state: {
      rowSelection,
      sorting,
      pagination,
    },
  });
  console.log(pagination);
  return (
    <div className="p-6">
      <TableToolbar
        table={table}
        onFiltersChange={handleFiltersChange}
        currentFilters={filters}
        omitColumnsById={["select"]}
      />
      <DataTable table={table} />
      <Pagination
        table={table}
        totalCount={data?.length ?? 0}
        pageSizeOptions={[10, 15, 20]}
      />
    </div>
  );
}
