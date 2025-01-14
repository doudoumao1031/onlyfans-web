import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { uploadMediaFile } from "./actions/media"

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

export function buildImageUrl(fileId: string) {
  return `https://imfanstest.potato.im/api/v1/media/img/${fileId}`
}

export function buildVideoUrl(fileId: string, quality: string) {
  return `https://imfanstest.potato.im/api/v1/media/videocut/${fileId}/${quality}`
}
