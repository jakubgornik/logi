"use client";

import { DataTable } from "@/components/data-table";
import { useManualTableState } from "@/hooks/use-manual-table-state";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { ReactNode, useMemo } from "react";
import { TableToolbar } from "@/components/filters/table-toolbar";
import { FilterColumn } from "@/components/filters/filters.types";
import Pagination from "@/components/pagination/pagination";
import { PaginatedResponse } from "@/lib/types/common.types";
import { Transaction } from "@/prisma/client/client";

import { useTransactionTableColumns } from "./use-transactions-table-columns";
import {
  useDeleteTransaction,
  useGetTransactions,
} from "@/hooks/transaction.hooks";
import {
  getSelectedIdsFromRowSelection,
  mapSortingToSortBy,
} from "@/modules/supplier/supplier-table.utils";
import { TransactionTableActions } from "./transaction-table-actions";

const PAGE_SIZE_OPTIONS = [10, 15, 20];

interface TransactionTableProps {
  initialData?: PaginatedResponse<Transaction>;
  children?: ReactNode;
}

export function TransactionTable({
  initialData,
  children,
}: TransactionTableProps) {
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
  const columns = useTransactionTableColumns();

  const { data, isPlaceholderData, isFetching, dataUpdatedAt } = useGetTransactions(
    {
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sortBy,
      filters: filters.filters,
    },
    initialData
  );

  reconcilePagination(data, isPlaceholderData, dataUpdatedAt);

  const { mutate: deleteTransaction } = useDeleteTransaction({
    onSuccess: () => {
      setRowSelection({});
    },
  });

  const items = useMemo(() => data?.data ?? [], [data]);

  const selectedTransactions = useMemo(() => {
    return items.filter((item) => selectedIds.includes(item.id));
  }, [items, selectedIds]);

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

  const additionalFilters: FilterColumn[] = [
    {
      id: "status",
      type: "select",
      label: "Status",
      loader: async () => [
        { value: "DRAFT", label: "Draft" },
        { value: "CONFIRMED", label: "Confirmed" },
      ],
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <TableToolbar
          table={table}
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
          omitColumnsById={["select", "status"]}
          additionalFilters={additionalFilters}
        />
        <TransactionTableActions
          selectedTransactions={selectedTransactions}
          selectedIds={selectedIds}
          onDelete={() => {
            deleteTransaction({ ids: selectedIds });
          }}
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
