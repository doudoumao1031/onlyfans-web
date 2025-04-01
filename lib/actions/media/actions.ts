"use server"

import type {
  UploadPartReq,
  CompleteFileReq,
  UploadPartResp
} from "@/lib"
import { ENDPOINTS, UploadRes, fetchWithGet, fetchWithPost } from "@/lib"


// file: File
// file_hash?: string
// file_count: string
// file_size: string
// file_type: FileType
export async function uploadMediaFile(params: FormData) {
  return fetchWithPost<FormData, UploadRes>(ENDPOINTS.MEDIA.UPLOAD, params)
}

export async function uploadPart(params: FormData) {
  console.log("===>uploadPart start:", params, "date:", new Date().toString())
  return fetchWithPost<FormData, UploadRes>(ENDPOINTS.MEDIA.UPLOAD_PART, params)
}

export async function completeFile(params: CompleteFileReq) {
  return fetchWithPost<CompleteFileReq, string>(ENDPOINTS.MEDIA.COMPLETE_FILE, params)
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

export async function mediaEnc() {
  return fetchWithGet(`${ENDPOINTS.MEDIA.MEDIA_ENC}`, null)
}

export async function mediaHls(id: string) {
  return fetchWithGet(`${ENDPOINTS.MEDIA.MEDIA_HLS}/${id}`, null)
}
export async function mediaHlsData(id: string) {
  return fetchWithGet(`${ENDPOINTS.MEDIA.MEDIA_HLSDATA}/${id}`, null)
}