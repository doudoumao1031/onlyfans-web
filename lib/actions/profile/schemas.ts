import { z } from "zod"

export const postVoteSchema = z.object({
  id: z.string().optional(),
  items: z.array(z.object({
    content: z.string().optional()
  }).required()).min(2, "最少两个选项"),
  mu_select: z.boolean(),
  stop_time: z.union([z.number().min(0, "请选择结束时间"), z.string().min(1, "请选择结束时间")]),
  title: z.string({ message: "请输入投票标题" }).min(2, "标题最少2个字")
})

export const postPriceSchema = z.array(z.object({
  id: z.string().optional(),
  price: z.union([z.string().refine(data => Number(data) < 999,"不能大于999").refine(data => Number(data) > -1, "不能小于0").optional(),z.number()]),
  user_type: z.number(),
  visibility: z.boolean()
}))

export const postSchema = z.object({
  post: z.object({
    id: z.number().optional(),
    notice: z.boolean(),
    title: z.string({ message: "请输入标题" }).min(2, "最少两个字").max(999, "最多999个字")
  }),
  post_attachment: z.array(z.object({
    file_id: z.string(),
    id: z.string().optional()
  })).optional(),
  post_price: postPriceSchema.min(1),
  post_vote: postVoteSchema.optional()
})
