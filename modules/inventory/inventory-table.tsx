"use client";

import { DataTable } from "@/components/data-table";
import { useManualTableState } from "@/hooks/use-manual-table-state";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { useMemo } from "react";
import Pagination from "@/components/pagination/pagination";
import { PaginatedResponse } from "@/lib/types/common.types";
import { mapSortingToSortBy } from "../supplier/supplier-table.utils";
import { TableToolbar } from "@/components/filters/table-toolbar";
import { useGetInventory } from "@/hooks/inventory.hooks";
import { IInventoryWithProduct } from "./inventory.types";
import { useInventoryTableColumns } from "./use-inventory-table-columns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SUB_ROUTES } from "@/lib/routes";

const PAGE_SIZE_OPTIONS = [10, 15, 20];

interface InventoryTableProps {
  initialData?: PaginatedResponse<IInventoryWithProduct>;
}

export function InventoryTable({ initialData }: InventoryTableProps) {
  const {
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

  const router = useRouter();

  const columns = useInventoryTableColumns();

  const sortBy = mapSortingToSortBy(sorting);

  const { data, isPlaceholderData, isFetching, dataUpdatedAt } = useGetInventory(
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
    onSortingChange: handleSortingChange,
    manualSorting: true,
    onPaginationChange: handlePaginationChange,
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
        <div className="pb-2">
          <Button
            variant="outline"
            size="sm"
            className="h-10"
            onClick={() => router.push(SUB_ROUTES.INVENTORY_CREATE)}
          >
            Add Product to Inventory
          </Button>
        </div>
      </div>
      <DataTable table={table} />
      <Pagination
        table={table}
        totalCount={totalCount}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        isLoading={isFetching || isPlaceholderData}
      />
    </div>
  );
}
