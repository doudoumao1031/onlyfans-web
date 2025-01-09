import { z } from "zod"
import { FileType } from "../shared/types"

export const uploadReqSchema = z.object({
  fileHash: z.string().optional(),
  fileCount: z.number().min(1),
  fileSize: z.number().min(1),
  fileType: z.nativeEnum(FileType)
})

export const uploadPartReqSchema = z.object({
  fileId: z.string(),
  partNo: z.number().min(0),
  fileHash: z.string()
})

export const completeFileReqSchema = z.object({
  fileId: z.string(),
  fileHash: z.string(),
  totalSize: z.number().min(1),
  mimeType: z.string(),
  originalName: z.string()
})
