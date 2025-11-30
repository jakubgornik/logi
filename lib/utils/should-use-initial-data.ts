import { PaginatedQuery, PaginatedResponse } from "@/lib/types/common.types";

export const shouldUseInitialData = <T>(
  query: Partial<PaginatedQuery>,
  initialData?: PaginatedResponse<T>
): boolean => {
  if (!initialData) return false;

  const isFirstPage = query.page === 0 || query.page === undefined;
  const hasNoFilters = !query.filters || query.filters.length === 0;
  const hasNoSorting = !query.sortBy || query.sortBy.length === 0;
  const matchesInitialPageSize = query.pageSize === initialData.pageSize;

  return isFirstPage && hasNoFilters && hasNoSorting && matchesInitialPageSize;
};
