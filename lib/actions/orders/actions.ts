import { ENDPOINTS } from "../shared/constants"
import {
  PostPayOrderReq,
  PostTipReq,
  SubOrderReq,
  WalletDownOrderReq,
  WalletOrderReq,
  DeleteOrderReq,
  OrderInfo, PayOrderResp, OrderCallBackReq
} from "@/lib"
import { fetchWithPost } from "@/lib"

export async function addPostPayOrder(params: PostPayOrderReq): Promise<OrderInfo> {
  // Implementation
  throw new Error("Not implemented")
}

/**
 * 打赏帖子
 * @param params
 */
export const addPostTip = (params: PostTipReq) => fetchWithPost<PostTipReq, string>(ENDPOINTS.ORDERS.ADD_POST_TIP, params)

/**
 * 增加订阅
 * @param params
 */
export const addSubOrder = (params: SubOrderReq) => fetchWithPost<SubOrderReq, unknown>(ENDPOINTS.ORDERS.ADD_SUB, params)


export async function addWalletDownOrder(params: WalletDownOrderReq): Promise<OrderInfo> {
  // Implementation
  throw new Error("Not implemented")
}

/**
 * 添加充值订单
 * @param params
 */
export async function addWalletOrder(params: WalletOrderReq) {
  return fetchWithPost<WalletOrderReq, PayOrderResp>(ENDPOINTS.ORDERS.ADD_WALLET, params)
}

/**
 * 充值订单回调
 * @param params
 */
export async function handleRechargeOrderCallback(params: OrderCallBackReq) {
  return fetchWithPost<OrderCallBackReq>(ENDPOINTS.ORDERS.BACK_PAY_MONEY, params)
}

export async function handleDownOrderCallback(params: string): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}

export async function deleteOrder(params: DeleteOrderReq): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}
