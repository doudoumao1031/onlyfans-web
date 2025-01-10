// Media related types and interfaces
import type { FileType } from "../shared/types"

export interface FileInfo {
  id: string
  url: string
  type: FileType
  size: number
  width?: number
  height?: number
  duration?: number
  mimeType: string
  originalName: string
}

export interface UploadReq {
  file: File
  fileHash?: string
  fileCount: number
  fileSize: number
  fileType: FileType
}

export interface UploadRes {
  "ext": string,
  "file_id": string,
  "file_name": string,
  "file_type": FileType
}

export interface UploadPartReq {
  fileId: string
  partNo: number
  fileHash: string
  file: File
}

export interface CompleteFileReq {
  fileId: string
  fileHash: string
  totalSize: number
  mimeType: string
  originalName: string
}

// Response types
export type UploadResp = FileInfo
export type UploadPartResp = FileInfo
