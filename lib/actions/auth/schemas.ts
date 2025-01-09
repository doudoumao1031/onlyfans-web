import { z } from "zod"

export const loginReqSchema = z.object({
  userId: z.string()
})

export const usersReqSchema = z.object({
  userId: z.string(),
  page: z.number().min(1),
  limit: z.number().min(1).max(100)
})