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
import { useGetContracts } from "@/hooks/contract.hooks";
import { useContractsTableColumns } from "./use-contracts-table-columns";
import { Contract } from "@/prisma/client/client";
import { getSelectedIdsFromRowSelection } from "../supplier/supplier-table.utils";

const PAGE_SIZE_OPTIONS = [10, 15, 20];

interface ContractTableProps {
  initialData?: PaginatedResponse<Contract>;
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

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const { data } = useGetContracts(
    {
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      //   sortBy,
      //   filters: filters.filters,
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

  return (
    <div className="p-6">
      <DataTable table={table} />
      <Pagination
        table={table}
        totalCount={totalCount}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />
    </div>
  );
}
