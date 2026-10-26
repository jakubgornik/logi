"use client";

import { DataTable } from "@/components/data-table";
import { useManualTableState } from "@/hooks/use-manual-table-state";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { ReactNode, useMemo } from "react";
import { useSupplierTableColumns } from "./use-supplier-table-columns";
import {
  getSelectedIdsFromRowSelection,
  mapSortingToSortBy,
} from "./supplier-table.utils";
import { TableToolbar } from "@/components/filters/table-toolbar";
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
  const {
    rowSelection,
    setRowSelection,
    sorting,
    filters,
    pagination,
    totalCount,
    pageCount,
    handleFiltersChange,
    handleSortingChange,
    handlePaginationChange,
    reconcilePagination,
  } = useManualTableState();
  const selectedIds = getSelectedIdsFromRowSelection(rowSelection);

  const sortBy = mapSortingToSortBy(sorting);

  const columns = useSupplierTableColumns();

  const { data, isPlaceholderData, isFetching, dataUpdatedAt } = useGetSuppliers(
    {
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sortBy,
      filters: filters.filters,
    },
    initialData
  );

  reconcilePagination(data, isPlaceholderData, dataUpdatedAt);

  const { mutate: deleteSupplier } = useDeleteSupplier({
    onSuccess: () => {
      setRowSelection({});
    },
  });

  const items = useMemo(() => data?.data ?? [], [data]);

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
    manualSorting: true,
    onPaginationChange: handlePaginationChange,
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
        isLoading={isFetching || isPlaceholderData}
      />
      {children}
    </div>
  );
}
