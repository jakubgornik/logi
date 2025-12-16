"use client";

import { DataTable } from "@/components/data-table";
import {
  useReactTable,
  getCoreRowModel,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import { ReactNode, useMemo, useState } from "react";
import { useSupplierTableColumns } from "./use-supplier-table-columns";
import {
  getSelectedIdsFromRowSelection,
  mapSortingToSortBy,
} from "./supplier-table.utils";
import { TableToolbar } from "@/components/filters/table-toolbar";
import { FilterState } from "@/components/filters/filters.types";
import Pagination from "@/components/pagination/pagination";
import { PaginatedResponse } from "@/lib/types/common.types";
import { useDeleteSupplier, useGetSuppliers } from "@/hooks/supplier.hooks";
import { Supplier } from "@/prisma/client/client";
import { SupplierTableActions } from "./supplier-table-actions";

const PAGE_SIZE_OPTIONS = [10, 15, 20];

interface SupplierTableProps {
  initialData?: PaginatedResponse<Supplier>;
  children?: ReactNode;
}

export function SupplierTable({ initialData, children }: SupplierTableProps) {
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
    setRowSelection({});
  };

  const { data } = useGetSuppliers(
    {
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sortBy,
      filters: filters.filters,
    },
    initialData
  );

  const { mutate: deleteSupplier } = useDeleteSupplier({
    onSuccess: () => {
      setRowSelection({});
    },
  });

  const items = useMemo(() => data?.data ?? [], [data]);
  const totalCount = useMemo(() => data?.totalCount ?? 0, [data]);
  const pageCount = useMemo(() => data?.totalPages, [data]);

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    manualSorting: true,
    onPaginationChange: setPagination,
    manualPagination: true,
    getRowId: (row) => row.id,
    pageCount,
    state: {
      rowSelection,
      sorting,
      pagination,
    },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <TableToolbar
          table={table}
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
          omitColumnsById={["select"]}
        />
        <SupplierTableActions
          selectedIds={selectedIds}
          onDelete={() =>
            deleteSupplier({
              ids: selectedIds,
            })
          }
        />
      </div>
      <DataTable table={table} enableRowSelection />
      <Pagination
        table={table}
        totalCount={totalCount}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />
      {children}
    </div>
  );
}
