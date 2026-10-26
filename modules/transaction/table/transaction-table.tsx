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
import { mapSortingToSortBy } from "@/modules/supplier/supplier-table.utils";
import { TransactionTableActions } from "./transaction-table-actions";
import { useTransactionSelection } from "./use-transaction-selection";

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

  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction({
      onSuccess: () => {
        setRowSelection({});
      },
    });

  const items = useMemo(() => data?.data ?? [], [data]);

  const { selectedIds, canDelete, canEdit } = useTransactionSelection({
    rowSelection,
    transactions: items,
    isPlaceholderData,
    dataUpdatedAt,
  });
  const isSelectionLocked = isPlaceholderData || isDeleting;
  const isPaginationLoading = isFetching || isSelectionLocked;
  const actionSelectionKey = JSON.stringify({
    ids: [...selectedIds].sort(),
    canDelete,
  });

  const handleDelete = () => {
    const isDeleteBlocked = !canDelete || isDeleting;

    if (isDeleteBlocked) return;

    deleteTransaction({ ids: [...selectedIds] });
  };

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: !isSelectionLocked,
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
          key={actionSelectionKey}
          selectedIds={selectedIds}
          canDelete={canDelete}
          canEdit={canEdit}
          isDeleting={isDeleting}
          onDelete={handleDelete}
        />
      </div>
      <DataTable table={table} enableRowSelection={!isSelectionLocked} />
      <Pagination
        table={table}
        totalCount={totalCount}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        isLoading={isPaginationLoading}
      />
      {children}
    </div>
  );
}
