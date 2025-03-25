// Order related types and interfaces
/**
 * 打赏请求 | 帖子付费请求
 */
export interface PostTipReq {
  post_id: number
  amount: number // 打赏金额
}

/**
 * 订阅请求
  */
export interface SubOrderReq {
  user_id: number //订阅用户id
  price: number //价格
  id: number //折扣属性id
}

export interface WalletDownOrderReq {
  amount: number
}

export interface WalletOrderReq {
  amount: number
}

/**
 * 充值下单返回
 */
export interface PayOrderResp {
  id: number
  user_id: number
  amount: number
  trade_no: string
  trade_type: number
  trade_status: boolean
}

/**
 * 原生调用支付参数
 */
export interface RechargeParam {
  currency: string | "USDT"
  amount: number
  tradeNo: string
}

/**
 * 原生回调支付参数
 */
export interface RechargeResp {
  result: "success" | "failed"
  tradeNo: string
}

export interface OrderCallBackReq {
  trade_no: string
}

export interface DeleteOrderReq {
  orderId: string
}

export interface OrderInfo {
  id: string
  userId: string
  orderType: number
  amount: number
  status: number
  payType: number
  transactionId?: string
  createdAt: string
  updatedAt: string
  postId?: string
  settingId?: string
  targetUserId?: string
}
