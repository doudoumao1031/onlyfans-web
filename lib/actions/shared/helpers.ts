// Shared utility functions

// 日期格式化
import { ApiResponse, FetchOptions } from "@/lib"

export function formatDate(date: string | Date, locale: string = "en-US"): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

// 分页计算
export function calculatePagination(
  total: number,
  currentPage: number,
  limit: number
): {
  hasNext: boolean
  hasPrev: boolean
} {
  const totalPages = Math.ceil(total / limit)
  return {
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  }
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

const getAuthToken = () => {
  return "26"
}

async function fetchResultHandle<T>(method: string, response: Response) {
  if (response.ok) {
    const result: ApiResponse<T> = await response.json()
    console.log(`Success-${method.toUpperCase()}-response:`, result)
    return result
  } else {
    console.error(`Error-${method.toUpperCase()}-response:`, response.status, response.statusText)
    const errorText = await response.text()
    console.error("Error details:", errorText)
  }
  return null
}

export async function fetchWithGet<Req, Res = unknown>(
  url: string,
  data: Req,
  options?: FetchOptions<Res>
) {
  try {
    const { headers = {} } = options ?? {}
    const qs = new URLSearchParams(data ?? {})
    const urlWithParams = `${apiUrl}${url}?${qs.toString()}`
    console.log("GET-url:", urlWithParams)
    const response = await fetch(urlWithParams, {
      method: "GET",
      headers: {
        "X-Token": getAuthToken(),
        ...headers
      }
    })
    return fetchResultHandle<Res>("GET", response)
  } catch (error) {
    console.error("Error-GET-catch:", error)
  }
  return null
}

export async function fetchWithPost<Req, Res = unknown>(
  url: string,
  data: Req,
  options?: FetchOptions<Res>
) {
  try {
    const { headers = {} } = options ?? {}
    const isFormData = data instanceof FormData
    const fullPath = `${apiUrl}${url}`
    console.log("POST-url:", fullPath)
    console.log("POST-data:", data)
    const response = await fetch(fullPath, {
      method: "POST",
      headers: {
        "X-Token": getAuthToken(),
        ...headers
      },
      body: isFormData ? data : JSON.stringify(data)
    })
    return fetchResultHandle<Res>("POST", response)
  } catch (error) {
    console.error("Error-POST-catch:", error)
  }
  return null
}

/**
 * 获取媒体地址
 * @param fileId
 */
export function buildMediaUrl(fileId: string) {
  return `${mediaUrl}${fileId}`
}
