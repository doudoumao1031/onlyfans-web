"use client"

import { useTranslations } from "next-intl"

import { useRouter } from "next/navigation"


import ErrorPage from "@/components/common/error-page"

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("Common")
  const router = useRouter()
  const reg = new RegExp("POST_NOT_FOUND")
  if (reg.test(error.toString())) {
    return (
      <div className="mt-[60px] flex flex-col items-center">
        <p className="text-text-desc mb-4 text-[15px]">{t("delText")}</p>
        <button
          className="bg-theme hover:bg-theme/90 flex items-center rounded-full px-4 py-2 text-white"
          onClick={() => {
            router.back()
          }}
        >
          <span className=" text-[15px]">{t("backPre")}</span>
        </button>
      </div>
    )
  }
  return <ErrorPage reset={reset} error={error} text={t("detailLoadError")} />
}
