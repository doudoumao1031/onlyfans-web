// Shared types and interfaces

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  code: number;
}

/**
 * list 返回结果
 */
export type PageResponse<T> = {
  list: T[]
  total: number
}


export type FetchTransformResponse<Res> = (response: ApiResponse<Res>) => Res

export type FetchOptions<Res> = {
  headers: Record<string, unknown>,
  transformResponse?: FetchTransformResponse<Res>,
}