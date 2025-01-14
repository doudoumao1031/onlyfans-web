import { CommonPageReq, ENDPOINTS, fetchWithGet, fetchWithPost, PageResponse } from "@/lib";
import { TFeeListItem } from "./types";

//我的帖子
export const getMyFeeds = (params: CommonPageReq) => {
  return fetchWithPost<CommonPageReq, PageResponse<TFeeListItem>>(ENDPOINTS.POST.ME_POSTS, params)
}