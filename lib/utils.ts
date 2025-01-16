import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { completeFile, uploadMediaFile, uploadPart } from "./actions/media"
import { ENDPOINTS, uploadFetch } from "@/lib/actions/shared"
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
    const chunks = createChunks(file)
    const firstChunk = chunks.shift() as Blob
    const fileId = await uploadFirstChunk(String(file.size), firstChunk, getUploadMediaFileType(file), totalChunks.toString())
    console.log("handleUploadFile totalChunks", totalChunks)

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
    return fileId
  } else {
    return await commonUploadFile(file)
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
  const requestList = chunksFormData.map(
    (data) => rcl.append(() => uploadFetch(ENDPOINTS.MEDIA.UPLOAD_PART, data))
  )
  // 上传所有切片
  await Promise.all(requestList)
}

const uploadChunksInBatches = async (fileId: string, file: File, totalChunks: number, batchSize: number) => {
  const failedChunks: { part_no: string; chunk: Blob }[] = []

  for (let i = 1; i < totalChunks; i += batchSize) {
    console.log("handleUploadFile batch", i, batchSize)
    const batchPromises = []
    for (let j = i; j < i + batchSize && j < totalChunks; j++) {
      const start = j * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, file.size)
      const chunk = file.slice(start, end)
      batchPromises.push(uploadFileChunk(fileId, String(j + 1), chunk).then(result => {
        if (!result) {
          failedChunks.push({ part_no: String(j + 1), chunk })
        }
      }))
      console.log("handleUploadFile batchPromises", batchPromises.length)
    }

    try {
      await Promise.all(batchPromises)
    } catch (error) {
      console.error("handleUploadFile part failed", error)
      return failedChunks
    }
  }

  return failedChunks
}

function createChunks(file:File) {
  const chunkList = [] // 收集所有的切片
  let offset = 0 // 收集的切片总大小
  const size = file.size
  while (offset < size) { // 当切片总大小小于文件大小时还需要继续分片
    chunkList.push(file.slice(offset, Math.min(offset + CHUNK_SIZE, size)))
    offset += CHUNK_SIZE
  }
  return chunkList
}

export function buildImageUrl(fileId: string) {
  return `https://imfanstest.potato.im/api/v1/media/img/${fileId}`
}

export function buildVideoUrl(fileId: string, quality: string) {
  return `https://imfanstest.potato.im/api/v1/media/videocut/${fileId}/${quality}`
}
