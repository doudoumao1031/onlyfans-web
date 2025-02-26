import Header from "@/components/common/header"
import React from "react"
import TopTab from "@/components/profile/fans/top-tab"
import { useTranslations } from "next-intl"

enum COLLECT_TYPE {
  BLOGGER = "BLOGGER",
  POSTS = "FOLLOW"
}
export default function Layout({ children }: {
  children: React.ReactNode,
}) {
  const t = useTranslations("Profile")
  const tabOptions = [
    { label: t("collect.blogger"), name: COLLECT_TYPE.BLOGGER, link: "/profile/collect/blogger" },
    { label: t("collect.posts"), name: COLLECT_TYPE.POSTS, link: "/profile/collect/posts" }
  ]
  return (
    <>
      <Header title={t("collect.collect")} titleColor={"#000"} />
      <TopTab tabOptions={tabOptions} />
      {children}
    </>
  )
}
