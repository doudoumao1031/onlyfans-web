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
  const t = useTranslations("Common")
  return <ErrorPage reset={reset} error={error} text={t("detailLoadError")} />
}
