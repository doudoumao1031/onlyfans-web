"use client"
import { useState } from "react"

import { Chart, ArcElement } from "chart.js"

import Header from "@/components/common/header"
import ChartsLine from "@/components/profile/chart-line"
import IconWithImage from "@/components/profile/icon"
import TabTitle, { iTabTitleOption } from "@/components/profile/tab-title"



Chart.register(ArcElement)
export type TPostItem = {
  avtar: string
  msg: string
  name: string
  background: string,
  isOpen: boolean
}
const mockPosts: TPostItem[] = [
  {
    avtar: "bg-[url('/demo/avtar1.jpeg')]",
    name: "Jamie Shon",
    msg: "amie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon@luvjamxoxo…",
    background: "bg-[url('/demo/blog-bg1.jpeg')]",
    isOpen: false
  },
  {
    avtar: "bg-[url('/demo/avtar2.jpeg')]",
    name: "Rita Leite",
    msg: "amie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon@luvjamxoxo…",
    background: "bg-[url('/demo/blog-bg2.jpeg')]",
    isOpen: true
  },
  {
    avtar: "bg-[url('/demo/avtar4.jpeg')]",
    name: "Virendra Sana",
    msg: "amie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon@luvjamxoxo…",
    background: "bg-[url('/demo/blog-bg4.jpeg')]",
    isOpen: false
  }
]
export default function Page() {
  const [active, setActive] = useState<string>("views")
  const [posts, setPosts] = useState<TPostItem[]>(mockPosts)
  const tabOptions: iTabTitleOption[] = [
    { label: "数据概览", name: "views" },
    { label: "帖子情况", name: "posts" }
  ]

  const Views = () => {
    return (
      <>
        <div className="p-4">
          <div className="flex justify-between">
            <div className="flex items-end">
              <h1 className="text-base font-medium">数据浏览</h1>
              <div className="ml-2 text-xs text-[#BBB] ">凌晨2点更新</div>
            </div>
            <span className="flex items-center text-[#777]">近30日   <IconWithImage url="/icons/profile/icon-bt.png" width={16} height={16} color={"#777"} /></span>
          </div>
          <div className="m-4 flex justify-between">
            <div className="flex h-16 w-32 flex-col items-center justify-center rounded-xl border border-[#FF8492] bg-[#FF8492] bg-opacity-20">
              <span className="text-xl font-medium">9999</span>
              <span className="text-xs text-gray-400">播放量</span>
            </div>
            <div className="flex h-16 w-32 flex-col items-center justify-center rounded-xl">
              <span className="text-xl font-medium">9.9W</span>
              <span className="text-xs text-gray-400">空间访客</span>
            </div>
            <div className="flex h-16 w-32 flex-col items-center justify-center rounded-xl">
              <span className="text-xl font-medium">99.9W</span>
              <span className="text-xs text-gray-400">订阅量</span>
            </div>
          </div>
          <ChartsLine />
        </div>
        <div className="p-4">
          <div className="flex justify-between">
            <div className="flex items-end">
              <h1 className="text-base font-medium">关注变化</h1>
              <div className="ml-2 text-xs text-[#BBB] ">凌晨2点更新</div>
            </div>
            <span className="flex items-center text-[#777]">近30日   <IconWithImage url="/icons/profile/icon-bt.png" width={16} height={16} color={"#777"} /></span>
          </div>
          <div className="m-4 flex justify-between">
            <div className="flex h-16 w-32 flex-col items-center justify-center  rounded-xl">
              <span className="text-xl font-medium">9999</span>
              <span className="text-xs text-gray-400">播放量</span>
            </div>
            <div className="flex h-16 w-32 flex-col items-center justify-center rounded-xl border border-[#FF8492] bg-[#FF8492] bg-opacity-20">
              <span className="text-xl font-medium">9.9W</span>
              <span className="text-xs text-gray-400">空间访客</span>
            </div>
            <div className="flex h-16 w-32 flex-col items-center justify-center rounded-xl">
              <span className="text-xl font-medium">99.9W</span>
              <span className="text-xs text-gray-400">订阅量</span>
            </div>
          </div>
          <ChartsLine />
        </div>
      </>
    )
  }
  const Posts = () => {
    return (
      <div className="p-4">
        <div className="mb-4 flex justify-between">
          <div className="flex items-end">
            <h1 className="text-base font-medium">帖子列表</h1>
            <div className="ml-2 text-xs text-[#BBB] ">展示最新发布的前20个帖子</div>
          </div>
          <span className="flex items-center text-[#777]">最新发布  <IconWithImage url="/icons/profile/icon-bt.png" width={16} height={16} color={"#777"} /></span>
        </div>
        {posts.map((v: TPostItem, i: number) => (
          <div key={i}>
            <div className={"mb-4   flex h-28 justify-between"}>
              <div className={`size-28 ${v.avtar} mr-2 shrink-0 rounded-md border border-slate-600 bg-cover`}></div>
              <div className="flex flex-col justify-between">
                <div className="">{v.msg}</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IconWithImage
                      url="/icons/profile/icon-video-g.png"
                      width={14}
                      color="#BBB"
                      height={14}
                    />
                    <span className="ml-2 text-xs text-[#BBB]">9999</span>
                  </div>
                  <div className="flex items-center text-[#BBB]" onClick={() => { openPost(i) }}>
                    <span>{v.isOpen ? "收起" : "详细"}</span>
                    <IconWithImage url="/icons/profile/icon-bt.png" width={14} height={14} color={"#BBB"} />
                  </div>
                </div>
              </div>
            </div>
            <div className={`my-3 flex flex-wrap overflow-hidden transition-all duration-1000 ${v.isOpen ? "h-auto" : "h-0"}`}>
              <div className="my-3 flex w-2/6 flex-col items-center justify-center">
                <span className="text-xl font-medium">99999</span>
                <span className="text-xs text-[#959595]">播放</span>
              </div>
              <div className="my-3 flex w-2/6 flex-col items-center justify-center">
                <span className="text-xl font-medium">99999</span>
                <span className="text-xs text-[#959595]">评论</span>
              </div>
              <div className="my-3 flex w-2/6 flex-col items-center justify-center">
                <span className="text-xl font-medium">99999</span>
                <span className="text-xs text-[#959595]">点赞</span>
              </div>
              <div className="my-3 flex w-2/6 flex-col items-center justify-center">
                <span className="text-xl font-medium">99999</span>
                <span className="text-xs text-[#959595]">分享</span>
              </div>
              <div className="my-3 flex w-2/6 flex-col items-center justify-center">
                <span className="text-xl font-medium">99999</span>
                <span className="text-xs text-[#959595]">打赏</span>
              </div>
              <div className="my-3 flex w-2/6 flex-col items-center justify-center">
                <span className="text-xl font-medium">99999</span>
                <span className="text-xs text-[#959595]">收藏</span>
              </div>

            </div>
          </div>
        ))}
      </div>
    )
  }
  const openPost = (i: number) => {
    const postData = JSON.parse(JSON.stringify(posts))
    postData[i].isOpen = !postData[i].isOpen
    setPosts(postData)

  }
  return (
    <>
      <Header title="数据中心" titleColor="#000" />
      <TabTitle tabOptions={tabOptions} active={active} activeChange={setActive} />
      {active === "views" ? Views() : Posts()}
    </>
  )
}