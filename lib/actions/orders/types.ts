// Order related types and interfaces

export interface PostPayOrderReq {
  postId: string
  payType: number
}

export interface PostTipReq {
  postId: string
  amount: number
  payType: number
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
  payType: number
}

export interface OrderCallbackReq {
  orderId: string
  status: number
  amount: number
  payType: number
  transactionId: string
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
