"use client";

import { useState } from "react";
import { functionalUpdate } from "@tanstack/react-table";
import type {
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import type { FilterState } from "@/components/filters/filters.types";
import type { PaginatedResponse } from "@/lib/types/common.types";

interface PageTotals {
  totalCount: number;
  updatedAt: number;
}

interface ManualTableState {
  filters: FilterState;
  sorting: SortingState;
  pagination: PaginationState;
  rowSelection: RowSelectionState;
  latestTotals?: PageTotals;
}

type PageResponse = Pick<
  PaginatedResponse<unknown>,
  "page" | "pageSize" | "totalCount"
>;

function getValidPageIndex(
  { pageIndex, pageSize }: PaginationState,
  totalCount?: number,
) {
  const requestedPageIndex = Math.max(0, pageIndex);

  if (totalCount === undefined) return requestedPageIndex;

  const lastPageIndex = Math.max(0, Math.ceil(totalCount / pageSize) - 1);

  return Math.min(requestedPageIndex, lastPageIndex);
}

export function useManualTableState() {
  const [state, setState] = useState<ManualTableState>({
    filters: { search: "", filters: [] },
    sorting: [],
    pagination: { pageIndex: 0, pageSize: 10 },
    rowSelection: {},
  });

  const handleFiltersChange = (filters: FilterState) => {
    setState((previous) => ({
      ...previous,
      filters,
      pagination: { ...previous.pagination, pageIndex: 0 },
      rowSelection: {},
      latestTotals: undefined,
    }));
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setState((previous) => ({
      ...previous,
      sorting: functionalUpdate(updater, previous.sorting),
      pagination: { ...previous.pagination, pageIndex: 0 },
      rowSelection: {},
    }));
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    setState((previous) => {
      const nextPagination = functionalUpdate(updater, previous.pagination);
      const hasPageSizeChanged =
        nextPagination.pageSize !== previous.pagination.pageSize;
      const pageIndex = hasPageSizeChanged
        ? 0
        : getValidPageIndex(nextPagination, previous.latestTotals?.totalCount);

      return {
        ...previous,
        pagination: { ...nextPagination, pageIndex },
        rowSelection: hasPageSizeChanged ? {} : previous.rowSelection,
      };
    });
  };

  const setRowSelection: OnChangeFn<RowSelectionState> = (updater) => {
    setState((previous) => ({
      ...previous,
      rowSelection: functionalUpdate(updater, previous.rowSelection),
    }));
  };

  const reconcilePagination = (
    data: PageResponse | undefined,
    isPlaceholderData: boolean,
    dataUpdatedAt: number,
  ) => {
    const isResponseUnavailable = data === undefined || isPlaceholderData;

    if (isResponseUnavailable) return;

    const { pagination, latestTotals: knownTotals } = state;
    const matchesCurrentPage =
      data.page === pagination.pageIndex &&
      data.pageSize === pagination.pageSize;

    if (!matchesCurrentPage) return;

    const hasNewerTotals =
      knownTotals === undefined || dataUpdatedAt > knownTotals.updatedAt;
    const nextTotals =
      knownTotals && !hasNewerTotals
        ? knownTotals
        : { totalCount: data.totalCount, updatedAt: dataUpdatedAt };
    const pageIndex = getValidPageIndex(pagination, nextTotals.totalCount);
    const hasPageChanged = pageIndex !== pagination.pageIndex;
    const shouldUpdatePagination = hasNewerTotals || hasPageChanged;

    if (!shouldUpdatePagination) return;

    setState({
      ...state,
      latestTotals: nextTotals,
      pagination: { ...pagination, pageIndex },
      rowSelection: hasPageChanged ? {} : state.rowSelection,
    });
  };

  return {
    filters: state.filters,
    sorting: state.sorting,
    pagination: state.pagination,
    rowSelection: state.rowSelection,
    totalCount: state.latestTotals?.totalCount ?? 0,
    pageCount: state.latestTotals
      ? Math.ceil(state.latestTotals.totalCount / state.pagination.pageSize)
      : undefined,
    handleFiltersChange,
    handleSortingChange,
    handlePaginationChange,
    setRowSelection,
    reconcilePagination,
  };
}
