import z from "zod";

export const IdArraySchema = z.object({
  ids: z.array(z.string()),
});

export type MultipleIdsPayload = z.infer<typeof IdArraySchema>;

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

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

type SuccessResult<T> = {
  success: true;
  data: T;
};

type ErrorResult = {
  success: false;
  error: string;
};

export type ServiceResult<T> = SuccessResult<T> | ErrorResult;
