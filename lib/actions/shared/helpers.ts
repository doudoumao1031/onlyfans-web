// Shared utility functions

// 日期格式化
import { ApiResponse, FetchOptions, FetchTransformResponse } from "@/lib"

export function formatDate(date: string | Date, locale: string = "en-US"): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

// 分页计算
export function calculatePagination(total: number, currentPage: number, limit: number): {
  hasNext: boolean;
  hasPrev: boolean
} {
  const totalPages = Math.ceil(total / limit)
  return {
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  }
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const getAuthToken = () => {
  return "1"
}

async function fetchResultHandle<T>(method: string, response: Response, transformResponse?: FetchTransformResponse<T>) {
  if (response.ok) {
    const result: ApiResponse<T> = await response.json()
    return transformResponse?.(result) ?? result
  } else {
    console.error(`Error-${method.toUpperCase()}-response:`, response.status, response.statusText)
    const errorText = await response.text()
    console.error("Error details:", errorText)
  }
  return null
}

export async function fetchWithGet<Req, Res>(url: string, data: Req, options?: FetchOptions<Res>): Promise<ApiResponse<Res> | null | Res> {
  try {
    const { headers = {}, transformResponse } = options ?? {}
    const qs = new URLSearchParams(data ?? {})
    const response = await fetch(`${apiUrl}${url}?${qs.toString()}`, {
      method: "GET",
      headers: {
        "X-Token": getAuthToken(),
        ...headers
      }
    })
    return fetchResultHandle<Res>("GET", response, transformResponse)
  } catch (error) {
    console.error("Error-GET-catch:", error)
  }
  return null
}

export async function fetchWithPost<Req, Res>(url: string, data: Req, options?: FetchOptions<Res>): Promise<ApiResponse<Res> | null | Res> {
  try {
    const { headers = {}, transformResponse } = options ?? {}
    const isFormData = data instanceof FormData
    const response = await fetch(`${apiUrl}${url}`, {
      method: "POST",
      headers: {
        "X-Token": getAuthToken(),
        ...headers
      },
      body: isFormData ? data : JSON.stringify(data)
    })
    return fetchResultHandle<Res>("POST", response, transformResponse)
  } catch (error) {
    console.error("Error-GET-catch:", error)
  }
  return null
}