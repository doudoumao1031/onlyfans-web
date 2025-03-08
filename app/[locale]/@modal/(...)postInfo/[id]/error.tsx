"use client"

import ErrorPage from "@/components/common/error-page"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

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
    return <div className="flex flex-col items-center mt-[60px]">
      <p className="text-[#6D7781] mb-4 text-[15px]">{t("delText")}</p>
      <button
        className="px-4 py-2 bg-background-theme text-white rounded-full hover:bg-opacity-90 flex items-center"
        onClick={() => {
          router.back()
        }}
      >
        <span className=" text-[15px]">{t("backPre")}</span>
      </button>
    </div>
  }
  return <ErrorPage reset={reset} error={error} text={t("detailLoadError")} />
}
