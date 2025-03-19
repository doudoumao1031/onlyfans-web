import Header from "@/components/common/header"
import React from "react"
import TopTab from "@/components/profile/fans/top-tab"
import { useTranslations } from "next-intl"
import { Tab } from "antd-mobile/es/components/tabs/tabs"
import TabLinks from "@/components/common/tab-link"

enum COLLECT_TYPE {
  BLOGGER = "BLOGGER",
  POSTS = "FOLLOW"
}
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
