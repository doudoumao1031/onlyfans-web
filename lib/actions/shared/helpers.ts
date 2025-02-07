// Shared utility functions

// 日期格式化
import { ApiResponse, FetchOptions } from "@/lib"
import { TOKEN_KEY } from "@/lib/utils"
import { cookies } from "next/headers"

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

export const getAuthToken = async () => {
  const cookiesStore = await cookies()
  return cookiesStore.get(TOKEN_KEY)?.value ?? ""
}

async function fetchResultHandle<T>(method: string, response: Response, url: string) {
  if (response.ok) {
    const result: ApiResponse<T> = await response.json()
    console.log(`Success-${method.toUpperCase()}-${url}-response:`, result)
    return result
  } else {
    console.error(
      `Error-${method.toUpperCase()}-${url}-response:`,
      response.status,
      response.statusText
    )
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
    const token = await getAuthToken()
    console.log("GET-url:", urlWithParams)
    const response = await fetch(urlWithParams, {
      method: "GET",
      headers: {
        [TOKEN_KEY]: token,
        ...headers
      }
    })
    return fetchResultHandle<Res>("GET", response, url)
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
        [TOKEN_KEY]: await getAuthToken(),
        ...headers
      },
      body: isFormData ? data : JSON.stringify(data)
    })
    return fetchResultHandle<Res>("POST", response, url)
  } catch (error) {
    console.error("Error-POST-catch:", error)
  }
  return null
}

export async function uploadFetch<Req, Res = unknown>(
  url: string,
  data: Req,
  options?: FetchOptions<Res>
) {
  const { headers = {} } = options ?? {}
  const isFormData = data instanceof FormData
  const fullPath = `${apiUrl}${url}`
  console.log("POST-url:", fullPath)
  console.log("POST-data:", data)
  return fetch(fullPath, {
    method: "POST",
    headers: {
      [TOKEN_KEY]: await getAuthToken(),
      ...headers
    },
    body: isFormData ? data : JSON.stringify(data)
  })
}
