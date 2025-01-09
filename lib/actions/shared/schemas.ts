// Shared form validation schemas
import { z } from "zod"

export const paginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1).max(100)
})

export const idSchema = z.object({
  id: z.string().uuid()
})
