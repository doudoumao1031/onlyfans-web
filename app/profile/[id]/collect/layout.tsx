import Header from "@/components/common/header"
import React from "react"
import TopTab from "@/components/profile/fans/top-tab"

enum COLLECT_TYPE {
  BLOGGER = "BLOGGER",
  POSTS = "FOLLOW"
}

const tabOptionsById = (id: string) => {
  return [
    { label: "博主", name: COLLECT_TYPE.BLOGGER, link: `/profile/${id}/collect/blogger` },
    { label: "帖子", name: COLLECT_TYPE.POSTS, link: `/profile/${id}/collect/posts` }
  ]
}

export default async function Layout({ children, params }: {
    children: React.ReactNode,
    params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <>
      <Header title="收藏夹" titleColor={"#000"} />
      <TopTab tabOptions={tabOptionsById(id)} />
      {children}
    </>
  )
}