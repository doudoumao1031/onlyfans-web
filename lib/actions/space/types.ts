// Recom related types and interfaces

/**
 * 分页公共请求
 */
export type CommonPageReq = {
  from_id: number | 0
  page: number | 1
  pageSize: number | 10
}

export type TFeeListItem = {
  name: string
}
export type TcommonPageReq = CommonPageReq & { user_id?: string }
