"use client";

import { DataTable } from "@/components/data-table";
import {
  useReactTable,
  getCoreRowModel,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FilterState } from "@/components/filters/filters.types";
import Pagination from "@/components/pagination/pagination";
import { PaginatedResponse } from "@/lib/types/common.types";
import { useDeleteContract, useGetContracts } from "@/hooks/contract.hooks";
import { useContractsTableColumns } from "./use-contracts-table-columns";
import { Contract } from "@/prisma/client/client";
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

  const columns = useContractsTableColumns();

  const sortBy = mapSortingToSortBy(sorting);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setRowSelection({});
  };

  const { data } = useGetContracts(
    {
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sortBy,
      filters: filters.filters,
    },
    initialData
  );

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
      <DataTable table={table} />
      <Pagination
        table={table}
        totalCount={totalCount}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />
    </div>
  );
}
