import { z } from "zod"

export const postVoteSchema = z.object({
  id: z.union([z.string(),z.number()]).optional(),
  items: z.array(z.object({
    content: z.string().max(20,"最多20个字").optional()
  }).required()).min(2, "最少两个选项"),
  mu_select: z.boolean(),
  stop_time: z.union([z.number().min(0, "请选择结束时间"), z.string().min(1, "请选择结束时间")]),
  title: z.string({ message: "请输入投票标题" }).min(2, "标题最少2个字").max(15,"不能超过15个字")
})

export const postPriceSchema = z.array(z.object({
  id: z.union([z.string(),z.number()]).optional(),
  price: z.union([z.string().refine(data => Number(data) < 999,"不能大于999").refine(data => Number(data) > -1, "不能小于0").optional(),z.number()]),
  user_type: z.number(),
  visibility: z.boolean()
})).nonempty("请设置订阅价格").refine(data => {
  const [first,second] = data
  return !(Number(first?.price) > 0 && Number(second?.price) === 0)
},{ message:"订阅价格大于0时，非订阅用户不能免费" ,path:[1,"price"] })

export const postSchema = z.object({
  post: z.object({
    id: z.number().optional(),
    notice: z.boolean(),
    title: z.string({ message: "请输入标题" }).min(5, "最少5个字").max(999, "最多999个字")
  }),
  post_attachment: z.array(z.object({
    file_id: z.union([z.string(),z.number()]),
    id: z.union([z.string(),z.number()]).optional()
  })).nullable().optional(),
  post_price: postPriceSchema.nullable(),
  post_vote: postVoteSchema.nullable().optional(),
  post_mention_user: z.array(z.object({ user_id: z.number() })).nullable().optional()
})
