"use client";

import { DataTable } from "@/components/data-table";
import { useManualTableState } from "@/hooks/use-manual-table-state";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { useMemo } from "react";
import Pagination from "@/components/pagination/pagination";
import { PaginatedResponse } from "@/lib/types/common.types";
import { useDeleteContract, useGetContracts } from "@/hooks/contract.hooks";
import { useContractsTableColumns } from "./use-contracts-table-columns";
import {
  getSelectedIdsFromRowSelection,
  mapSortingToSortBy,
} from "../supplier/supplier-table.utils";
import { TableToolbar } from "@/components/filters/table-toolbar";
import { ContractTableActions } from "./contract-table-actions";
import { IContractWithSupplier } from "./contract.types";

const PAGE_SIZE_OPTIONS = [10, 15, 20];

const additionalFilters = [
  {
    id: "validityDays",
    label: "Validity Days",
    type: "numberRange" as const,
  },
];

interface ContractTableProps {
  initialData?: PaginatedResponse<IContractWithSupplier>;
}

export function ContractTable({ initialData }: ContractTableProps) {
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

  const columns = useContractsTableColumns();

  const sortBy = mapSortingToSortBy(sorting);

  const { data, isPlaceholderData, isFetching, dataUpdatedAt } = useGetContracts(
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

  const { mutate: deleteSupplier } = useDeleteContract({
    onSuccess: () => {
      setRowSelection({});
    },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <TableToolbar
          table={table}
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
          omitColumnsById={["select", "validUntil"]}
          additionalFilters={additionalFilters}
        />
        <ContractTableActions
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
    </div>
  );
}
