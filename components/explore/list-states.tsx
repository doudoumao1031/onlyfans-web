"use client"
import { useTranslations } from "next-intl"

export function ListError() {
  const t = useTranslations("Common")
  return <div className="text-theme mt-4 text-center">{t("listError")}</div>
}

export function ListLoading() {
  const t = useTranslations("Common")
  return (
    <div className="mt-4 text-center">
      <button className="btn btn-primary loading">{t("loading1")}</button>
    </div>
  )
}

export function ListEnd() {
  const t = useTranslations("Common")
  return (
    <div className="mt-4 text-center">
      <p className="text-gray-500">{t("listEnd")}</p>
    </div>
  )
}
