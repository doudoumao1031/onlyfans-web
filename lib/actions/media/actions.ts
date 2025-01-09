"use server"

import { ENDPOINTS } from "../shared/constants"
import type {
  UploadReq,
  UploadPartReq,
  CompleteFileReq,
  UploadResp,
  UploadPartResp
} from "./types"

export async function uploadFile(params: UploadReq): Promise<UploadResp> {
  // Implementation
  throw new Error("Not implemented")
}

export async function uploadPart(params: UploadPartReq): Promise<UploadPartResp> {
  // Implementation
  throw new Error("Not implemented")
}

export async function completeFile(params: CompleteFileReq): Promise<void> {
  // Implementation
  throw new Error("Not implemented")
}

export async function downloadRangeFile(fileId: string, range?: string): Promise<Blob> {
  // Implementation
  throw new Error("Not implemented")
}

export async function getImage(fileId: string): Promise<Blob> {
  // Implementation
  throw new Error("Not implemented")
}

export async function getImageCut(fileId: string, width: number, height: number): Promise<Blob> {
  // Implementation
  throw new Error("Not implemented")
}

export async function getVideo(fileId: string, range?: string): Promise<Blob> {
  // Implementation
  throw new Error("Not implemented")
}

export async function getVideoCut(fileId: string, resRate: string, range?: string): Promise<Blob> {
  // Implementation
  throw new Error("Not implemented")
}
