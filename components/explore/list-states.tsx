import React from "react"
import { getTranslations } from "next-intl/server"

export async function ListError() {
  const t = await getTranslations("Common")
  return <div className="text-center mt-4 text-pink">{t("listError")}</div>
}

export async function ListLoading() {
  const t = await getTranslations("Common")
  return (
    <div className="text-center mt-4">
      <button className="btn btn-primary loading">{t("loading1")}</button>
    </div>
  )
}

export async function ListEnd() {
  const t = await getTranslations("Common")
  return (
    <div className="text-center mt-4">
      <p className="text-gray-500">{t("listEnd")}</p>
    </div>
  )
}
