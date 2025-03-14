import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { completeFile, uploadMediaFile, uploadPart } from "./actions/media"
import { ENDPOINTS, FileType, uploadFetch } from "@/lib/actions/shared"
import { PromiseConcurrency } from "@/lib/promise-curr"

// 文件分片大小2M
const CHUNK_SIZE = 1024 * 1024 * 2
const BATCH_SIZE = 10
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

export const getUploadMediaFileType = (file: File) => {
  const type = file.type.toLowerCase()
  if (type.includes("video")) {
    return FileType.Video
  }
  if (type.includes("image")) {
    return FileType.Image
  }
  return FileType.Other
}

export async function commonUploadFile(file: File) {
  const formData = new FormData()
  const fileType = getUploadMediaFileType(file)
  formData.append("file_count", "1")
  formData.append("file_size", String(file.size))
  formData.append("file_type", String(fileType))
  formData.append("file", file)
  const response = await uploadMediaFile(formData)
  if (response?.data) {
    return response.data
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

export async function uploadFileChunk(fileId: string, part_no: string, file: Blob) {
  const formData = new FormData()
  formData.append("file_id", fileId)
  formData.append("part_no", part_no)
  formData.append("file", file)
  formData.append("file_hash", "file_hash")
  const response = await uploadPart(formData)
  if (response && response.code == 0) {
    return response.data?.file_id
  }
  return null
}

const uploadFirstChunk = async (size: string, file: Blob, type: string, count?: string) => {
  const fd = new FormData()
  fd.append("file_count", count ?? "1")
  fd.append("file_size", size)
  fd.append("file_type", type)
  fd.append("file", file)
  return uploadMediaFile(fd).then((data) => {
    if (data && data.code == 0) {
      return data.data
    } else {
      return null
    }
  })
}
export async function uploadFile(file: File) {
  console.log("handleUploadFile", file.name, file.size)
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE) // 计算分片总数
  console.log("handleUploadFile multi", totalChunks)

  if (totalChunks > 1) {
    const chunks = createChunks(file)
    const firstChunk = chunks.shift() as Blob
    const chunkResult = await uploadFirstChunk(
      String(file.size),
      firstChunk,
      String(getUploadMediaFileType(file)),
      totalChunks.toString()
    )
    console.log("handleUploadFile totalChunks", totalChunks)
    const fileId = chunkResult?.file_id
    if (!fileId) {
      console.log("upload file part first chunk failed")
      return ""
    }
    await uploadBatch(fileId, chunks)
    // 完成上传
    const completeResponse = await completeFile({ file_id: fileId })
    if (completeResponse && completeResponse.code !== 0) {
      console.log("handleUploadFile complete file failed:", completeResponse.message)
      return ""
    }
    console.log("handleUploadFile complete file")
    return chunkResult
  } else {
    return commonUploadFile(file)
  }
}

const uploadBatch = async (fileId: string, chunks: Blob[]) => {
  const chunksFormData = chunks.map((chunk, index) => {
    const formData = new FormData()
    formData.append("file_id", fileId)
    formData.append("part_no", String(index + 2))
    formData.append("file", chunk)
    formData.append("file_hash", "file_hash")
    return formData
  })
  const rcl = new PromiseConcurrency({ limit: BATCH_SIZE, retry: 3 }) // 最大请求并发数为10，重试次数3
  // 将所有的切片请求append到rcl控制器中
  const requestList = chunksFormData.map((data) =>
    rcl.append(() => uploadFetch(ENDPOINTS.MEDIA.UPLOAD_PART, data))
  )
  // 上传所有切片
  await Promise.all(requestList)
}

function createChunks(file: File) {
  const chunkList = [] // 收集所有的切片
  let offset = 0 // 收集的切片总大小
  const size = file.size
  while (offset < size) {
    // 当切片总大小小于文件大小时还需要继续分片
    chunkList.push(file.slice(offset, Math.min(offset + CHUNK_SIZE, size)))
    offset += CHUNK_SIZE
  }
  return chunkList
}

/**
 * 随机获取用户背景图
 * @param username 用户名
 */
export function getUserDefaultBackImg(username: string) {
  if (username.length === 0) {
    // return "/icons/default/image_fans_normal_01.png"
    return "/icons/image_fans_normal_05.png"
  }
  const firstCharCode = Math.min(username.charCodeAt(0), 0xffff)
  const index = ((username.length + firstCharCode) % 6) + 1
  // 返回背景图路径
  // return `/icons/default/image_fans_normal_0${index}.png`
  //默认固定
  return "/icons/image_fans_normal_05.png"
}

export function buildImageUrl(fileId: string) {
  return fileId ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${fileId}` : ""
}

export function buildVideoUrl(fileId: string, quality: string) {
  return `${process.env.NEXT_PUBLIC_VIDEO_URL}/${fileId}/${quality}`
}

export const TOKEN_KEY = "X-Token"
export const USER_KEY = "USER_ID"

export function getEvenlySpacedPoints<T>(arr: T[], count = 12) {
  if (arr.length <= count) return arr // If array length is less than or equal to count, return it as is
  const step = (arr.length - 1) / (count - 1)
  return Array.from({ length: count }, (_, i) => arr[Math.round(i * step)])
}
export function getDateRange({ start, end }: { start: string, end: string }) {
  const dateArray = [] // 用于存储日期的数组
  const currentDate = new Date(start) // 将开始日期转换为 Date 对象

  // 将结束日期转换为 Date 对象
  const endDateObj = new Date(end)

  // 循环生成日期范围内的每一天
  while (currentDate <= endDateObj) {
    // 格式化日期为 yyyy-mm-dd
    const formattedDate = currentDate.toISOString().split("T")[0]
    dateArray.push(formattedDate) // 将格式化后的日期添加到数组
    currentDate.setDate(currentDate.getDate() + 1) // 增加一天
  }

  return getEvenlySpacedPoints(dateArray)
}


export const TIME_FORMAT = "YYYY-MM-DD HH:mm:ss"