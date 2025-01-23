// Order related types and interfaces

export interface PostPayOrderReq {
  postId: string
  payType: number
}

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
  bankName: string
  bankAccount: string
  bankAccountName: string
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
