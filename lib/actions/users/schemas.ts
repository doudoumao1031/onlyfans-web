import { z } from "zod"

export const pageInfoSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  lastId: z.string().optional()
})


export const bundlePriceSchema = z.string({ message:"请输入" }).refine(d => Number(d) > 1.99,"不能小于2").refine(d => Number(d) < 10000,"不能超过9999.99")

export const bundleSubscribe = z.object({
  month_count: z.union([z.number({ message:"请选择" }), z.string({ message:"请选择" })]),
  price: bundlePriceSchema
})

export const baseSubscribe = z.object({
  price: z.union([z.string({ message:"请输入" }).refine(d => Number(d) >= 0,"最小为0"),z.number().min(0)])
})

export const addDiscount = z.object({
  id: z.number({ message:"请选择" }),
  discount_per: z.string({ message:"请输入" }).refine(d => Number(d) >= 1,"不能小于1").refine(d => Number(d) <= 90,"不能超过90"),
  discount_start_time: z.number({ message:"请选择开始时间" }),
  discount_end_time: z.number({ message:"请选择结束时间" })
}).refine((data) => {
  return data.discount_end_time > data.discount_start_time
}, {
  message: "结束时间必须大于开始时间",
  path: ["discount_end_time"]
})