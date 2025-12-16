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
import { mapSortingToSortBy } from "../supplier/supplier-table.utils";
import { TableToolbar } from "@/components/filters/table-toolbar";
import { useGetInventory } from "@/hooks/inventory.hooks";
import { IInventoryWithProduct } from "./inventory.types";
import { useInventoryTableColumns } from "./use-inventory-table-columns";

const PAGE_SIZE_OPTIONS = [10, 15, 20];

interface InventoryTableProps {
  initialData?: PaginatedResponse<IInventoryWithProduct>;
}

export function InventoryTable({ initialData }: InventoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    filters: [],
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useInventoryTableColumns();

  const sortBy = mapSortingToSortBy(sorting);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const { data } = useGetInventory(
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
    onSortingChange: setSorting,
    manualSorting: true,
    onPaginationChange: setPagination,
    manualPagination: true,
    getRowId: (row) => row.id,
    pageCount,
    state: {
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
