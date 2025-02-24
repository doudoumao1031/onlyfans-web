"use client"

import ErrorPage from "@/components/common/error-page"
import { useTranslations } from "next-intl"
export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("Explore.postLoadError")
  return <ErrorPage reset={reset} error={error} text={t("postLoadError")} />
}
