import z from "zod";
import { jsonParse } from "../utils/json-parse";

export const IdArraySchema = z.object({
  ids: z.array(z.string()),
});

export type MultipleIdsPayload = z.infer<typeof IdArraySchema>;

export const sortBySchema = z.object({
  field: z.string(),
  direction: z.enum(["asc", "desc"]),
});

export type SortBy = z.infer<typeof sortBySchema>;

export const filterSchema = z.object({
  column: z.string(),
  type: z.string().optional(),
  value: z.any(),
});

export type FiltersType = z.infer<typeof filterSchema>;

export const baseQuerySchema = z.object({
  search: z.string().optional(),
  sortBy: jsonParse(z.array(sortBySchema)).optional(),
  filters: jsonParse(z.array(filterSchema)).optional(),
});

export const paginatedQuerySchema = baseQuerySchema.extend({
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).default(10),
});

export type PaginatedQuery = z.infer<typeof paginatedQuerySchema>;

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

type SuccessResult<T> = {
  success: true;
  data: T;
};

type ErrorResult = {
  success: false;
  error: string;
};

export type ServiceResult<T> = SuccessResult<T> | ErrorResult;

export type Option = {
  label: string;
  value: string;
};
