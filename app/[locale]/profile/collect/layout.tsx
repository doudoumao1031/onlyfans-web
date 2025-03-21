import React from "react"

import { useTranslations } from "next-intl"

import Header from "@/components/common/header"
import TabLinks from "@/components/common/tab-link"

export default function Layout({ children }: {
  children: React.ReactNode,
}) {
  const t = useTranslations("Profile")
  const tabOptions = [
    { name: t("collect.blogger"), href: "/profile/collect/blogger" },
    { name: t("collect.posts"), href: "/profile/collect/posts" }
  ]
  return (
    <>
      <Header title={t("collect.collect")} titleColor={"#000"} />
      <TabLinks links={tabOptions} />
      {children}
    </>
  )
}
