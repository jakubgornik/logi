import { DateRange } from "react-day-picker";

export type SelectOption = {
  label: string;
  value: string;
};

export type NumberRangeValue = {
  min: string;
  max: string;
};

export type loaderType = () => Promise<SelectOption[] | undefined>;

export type AvailableFilterTypes =
  | "text"
  | "dateRange"
  | "select"
  | "numberRange";

export type AvailableValueTypes =
  | string
  | DateRange
  | string[]
  | NumberRangeValue;

export interface FilterDefinition {
  column: string;
  value: AvailableValueTypes;
  type: AvailableFilterTypes;
}

export interface FilterState {
  search?: string;
  filters: FilterDefinition[];
}

export interface FilterColumn {
  id: string;
  label: string;
  type: AvailableFilterTypes;
  loader?: loaderType;
}

export interface FilterRule extends FilterColumn {
  value?: AvailableValueTypes;
}
