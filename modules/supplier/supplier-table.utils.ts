import { SortingState } from "@tanstack/react-table";
import { SortBy } from "./supplier.types";

export const getSelectedIdsFromRowSelection = (
  rowSelection: Record<string, boolean>
): string[] => {
  return Object.keys(rowSelection).filter((id) => rowSelection[id]);
};

export const mapSortingToSortBy = (sorting: SortingState): SortBy[] => {
  return sorting.map((sort) => ({
    field: sort.id,
    direction: sort.desc ? "desc" : "asc",
  }));
};
