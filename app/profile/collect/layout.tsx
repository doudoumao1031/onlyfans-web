import Header from "@/components/common/header"
import React from "react"
import TopTab from "@/components/profile/fans/top-tab"

enum COLLECT_TYPE {
  BLOGGER = "BLOGGER",
  POSTS = "FOLLOW"
}
export default function Layout({ children}: {
  children: React.ReactNode,
}) {
  const tabOptions = [
    { label: "博主", name: COLLECT_TYPE.BLOGGER, link: `/profile/collect/blogger` },
    { label: "帖子", name: COLLECT_TYPE.POSTS, link: `/profile/collect/posts` }
  ]
  return (
    <>
      <Header title="收藏夹" titleColor={"#000"} />
      <TopTab tabOptions={tabOptions} />
      {children}
    </>
  )
}
