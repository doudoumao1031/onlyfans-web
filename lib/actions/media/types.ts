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
  file_id: string
  part_no: number
  file_hash: string
  file: File
}

export interface CompleteFileReq {
  file_id: string
}

// Response types
export type UploadResp = FileInfo
export type UploadPartResp = FileInfo
