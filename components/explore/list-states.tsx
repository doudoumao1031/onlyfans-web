"use client"
import { useTranslations } from "next-intl"

export function ListError() {
  const t = useTranslations("Common")
  return <div className="text-center mt-4 text-pink">{t("listError")}</div>
}

export function ListLoading() {
  const t = useTranslations("Common")
  return (
    <div className="text-center mt-4">
      <button className="btn btn-primary loading">{t("loading1")}</button>
    </div>
  )
}

export function ListEnd() {
  const t = useTranslations("Common")
  return (
    <div className="text-center mt-4">
      <p className="text-gray-500">{t("listEnd")}</p>
    </div>
  )
}
