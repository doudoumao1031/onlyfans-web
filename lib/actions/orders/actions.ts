import { ENDPOINTS ,
  PostTipReq,
  SubOrderReq,
  WalletDownOrderReq,
  WalletOrderReq,
  DeleteOrderReq,
  PayOrderResp, OrderCallBackReq
, fetchWithPost,
IosPayMoneyOrderReq } from "@/lib"

/**
 * 增加帖子付费记录
 * @param params
 */
export async function addPostPayOrder(params: PostTipReq) {
  return fetchWithPost<PostTipReq>(ENDPOINTS.ORDERS.ADD_POST_PAY, params)
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


export async function addWalletDownOrder(params: WalletDownOrderReq) {
  return fetchWithPost<WalletDownOrderReq>(ENDPOINTS.ORDERS.ADD_WALLET_DOWN,params)
}

/**
 * 添加充值订单
 * @param params
 */
export async function addWalletOrder(params: WalletOrderReq) {
  return fetchWithPost<WalletOrderReq, PayOrderResp>(ENDPOINTS.ORDERS.ADD_WALLET, params)
}

/**
 * 充值订单回调 （安卓）
 * @param params
 */
export async function handleRechargeOrderCallback(params: OrderCallBackReq) {
  return fetchWithPost<OrderCallBackReq>(ENDPOINTS.ORDERS.BACK_PAY_MONEY, params)
}

/**
 * ios充值订单回调
 * @param params
 * @returns
 */
export const handleIosBackPayMoneyOrder = async (params: IosPayMoneyOrderReq) => {
  const res = await fetchWithPost<IosPayMoneyOrderReq, string>(ENDPOINTS.ORDERS.IOS_PAY_MONEY, params)
  if (res && res.code === 0) {
    return true
  }
  return false
}

export async function deleteOrder(params: DeleteOrderReq): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}
