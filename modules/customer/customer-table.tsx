"use client";

import { DataTable } from "@/components/data-table";
import { useManualTableState } from "@/hooks/use-manual-table-state";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { ReactNode, useMemo } from "react";
import { TableToolbar } from "@/components/filters/table-toolbar";
import Pagination from "@/components/pagination/pagination";
import { PaginatedResponse } from "@/lib/types/common.types";
import { Customer } from "@/prisma/client/client";
import { useDeleteCustomer, useGetCustomers } from "@/hooks/customer.hooks";
import {
  getSelectedIdsFromRowSelection,
  mapSortingToSortBy,
} from "../supplier/supplier-table.utils";
import { useCustomerTableColumns } from "./use-customer-table-columns";
import { CustomerTableActions } from "./customer-table-actions";

const PAGE_SIZE_OPTIONS = [10, 15, 20];

interface CustomerTableProps {
  initialData?: PaginatedResponse<Customer>;
  children?: ReactNode;
}

export function CustomerTable({ initialData, children }: CustomerTableProps) {
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
  const columns = useCustomerTableColumns();
  const { mutate: deleteCustomer } = useDeleteCustomer({
    onSuccess: () => {
      setRowSelection({});
    },
  });

  const { data, isPlaceholderData, isFetching, dataUpdatedAt } = useGetCustomers(
    {
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sortBy,
      filters: filters.filters,
    },
    initialData
  );

  reconcilePagination(data, isPlaceholderData, dataUpdatedAt);

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
        <CustomerTableActions
          selectedIds={selectedIds}
          onDelete={() =>
            deleteCustomer({
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
