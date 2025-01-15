import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { completeFile, uploadMediaFile, uploadPart } from "./actions/media"

// 文件分片大小2M
const CHUNK_SIZE = 1024 * 1024 * 2
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertImageToBase64(file: File) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      resolve(e?.target?.result)
    }
    reader.readAsDataURL(file)
  })
}

enum UPLOAD_MEDIA_TYPE {
  PIC = "1", // 图片
  VIDEO = "2", // 视频
  OTHER = "3" // 其他附件
}

export const getUploadMediaFileType = (file: File) => {
  const type = file.type.toLowerCase()
  if (type.includes("video")) {
    return UPLOAD_MEDIA_TYPE.VIDEO
  }
  if (type.includes("image")) {
    return UPLOAD_MEDIA_TYPE.PIC
  }
  return UPLOAD_MEDIA_TYPE.OTHER
}

export async function commonUploadFile(file: File) {
  const formData = new FormData()
  const fileType = getUploadMediaFileType(file)
  formData.append("file_count", "1")
  formData.append("file_size", String(file.size))
  formData.append("file_type", fileType)
  formData.append("file", file)
  const response = await uploadMediaFile(formData)
  if (response?.data) {
    return response.data?.file_id
  }
  return null
  // uploadMediaFile(formData).then((data) => {
  //   if (data?.data) {
  //     append({
  //       file_id: data.data.file_id
  //     })
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-expect-error
  //     ref.current.value = null
  //   }
  // })
}

export async function uploadFilePart(fileId: string, part_no: string, file: Blob) {
  const formData = new FormData()
  formData.append("file_id", fileId)
  formData.append("part_no", part_no)
  formData.append("file", file)
  formData.append("file_hash", "")
  const response = await uploadPart(formData)
  if (response?.data) {
    return response.data?.file_id
  }
  return null
}

const uploadFirstPart = async (size: string, file: Blob, type: string, count?: string) => {
  const fd = new FormData()
  fd.append("file_count", count ?? "1")
  fd.append("file_size", size)
  fd.append("file_type", type)
  fd.append("file", file)
  return uploadMediaFile(fd).then((data) => {
    if (data?.data) {
      return data.data.file_id
    } else {
      return ""
    }
  })
}
export async function uploadFile(file: File) {
  console.log("handleUploadFile", file.name, file.size)
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE) // 计算分片总数
  console.log("handleUploadFile multi", totalChunks)
  if (totalChunks > 1) {
    const fileId = await uploadFirstPart(String(file.size), file.slice(0, CHUNK_SIZE), getUploadMediaFileType(file), totalChunks.toString())
    console.log("handleUploadFile totalChunks", totalChunks)
    for (let i = 1; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, file.size)
      const chunk = file.slice(start, end)
      await uploadFilePart(fileId, String(i + 1), chunk) // 上传分片
      console.log("handleUploadFile upload part", i)
    }
    await completeFile({ file_id: fileId }) // 完成上传
    console.log("handleUploadFile complete file")
    return fileId
  } else {
    console.log("handleUploadFile once")
    return await commonUploadFile(file)
  }
}

export function buildImageUrl(fileId: string) {
  return `https://imfanstest.potato.im/api/v1/media/img/${fileId}`
}

export function buildVideoUrl(fileId: string, quality: string) {
  return `https://imfanstest.potato.im/api/v1/media/videocut/${fileId}/${quality}`
}
