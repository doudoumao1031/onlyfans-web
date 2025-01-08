// Shared utility functions

// 日期格式化
export function formatDate(date: string | Date, locale: string = "en-US"): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

// 分页计算
export function calculatePagination(total: number, currentPage: number, limit: number): { hasNext: boolean; hasPrev: boolean } {
  const totalPages = Math.ceil(total / limit)
  return {
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  }
}