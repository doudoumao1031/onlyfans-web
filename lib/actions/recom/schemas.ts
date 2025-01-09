import { z } from "zod"

export const pageInfoSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  lastId: z.string().optional()
})
