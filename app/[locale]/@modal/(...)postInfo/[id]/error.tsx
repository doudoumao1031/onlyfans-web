"use client"

import ErrorPage from "@/components/common/error-page"
export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorPage reset={reset} error={error} text="详情加载失败" />
}
