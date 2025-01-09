"use server"

import { ENDPOINTS } from "../shared/constants"
import type {
  PostPayOrderReq,
  PostTipReq,
  SubOrderReq,
  WalletDownOrderReq,
  WalletOrderReq,
  OrderCallbackReq,
  DeleteOrderReq,
  OrderInfo
} from "./types"

export async function addPostPayOrder(params: PostPayOrderReq): Promise<OrderInfo> {
  // Implementation
  throw new Error("Not implemented")
}

export async function addPostTip(params: PostTipReq): Promise<OrderInfo> {
  // Implementation
  throw new Error("Not implemented")
}

export async function addSubOrder(params: SubOrderReq): Promise<OrderInfo> {
  // Implementation
  throw new Error("Not implemented")
}

export async function addWalletDownOrder(params: WalletDownOrderReq): Promise<OrderInfo> {
  // Implementation
  throw new Error("Not implemented")
}

export async function addWalletOrder(params: WalletOrderReq): Promise<OrderInfo> {
  // Implementation
  throw new Error("Not implemented")
}

export async function handleDownOrderCallback(params: OrderCallbackReq): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}

export async function handlePayOrderCallback(params: OrderCallbackReq): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}

export async function deleteOrder(params: DeleteOrderReq): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}
