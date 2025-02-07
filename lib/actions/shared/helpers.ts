// Shared utility functions
import { ApiResponse, FetchOptions } from "@/lib"
import { TOKEN_KEY } from "@/lib/utils"

// Client-side cookie getter
const getClientCookie = (key: string) => {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${key}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null
  return null
}

export function formatDate(date: string | Date, locale: string = "en-US"): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
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

export { fetchWithGet, fetchWithPost, uploadFetch } from "../server-actions"
