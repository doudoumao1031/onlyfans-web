import { z } from "zod"

export const postPayOrderReqSchema = z.object({
  postId: z.string(),
  payType: z.number()
})

export const postTipReqSchema = z.object({
  postId: z.string(),
  amount: z.number().min(0),
  payType: z.number()
})

export const subOrderReqSchema = z.object({
  userId: z.string(),
  settingId: z.string(),
  payType: z.number()
})

export const walletDownOrderReqSchema = z.object({
  amount: z.number().min(0),
  bankName: z.string(),
  bankAccount: z.string(),
  bankAccountName: z.string()
})

export const walletOrderReqSchema = z.object({
  amount: z.number().min(0),
  payType: z.number()
})

export const orderCallbackReqSchema = z.object({
  orderId: z.string(),
  status: z.number(),
  amount: z.number(),
  payType: z.number(),
  transactionId: z.string()
})

export const deleteOrderReqSchema = z.object({
  orderId: z.string()
})
