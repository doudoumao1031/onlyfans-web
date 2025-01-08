// Media related types and interfaces

export enum FileType {
  Image = "1",
  Video = "2",
  Other = "3"
}

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
