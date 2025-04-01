"use client"

import { useTranslations } from "next-intl"

import ErrorPage from "@/components/common/error-page"

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("Common")
  return <ErrorPage reset={reset} error={error} text={t("ContentLoadingFailed")} />
}
