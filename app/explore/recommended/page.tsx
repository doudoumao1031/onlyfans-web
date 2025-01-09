"use client"
import { recomBlogger } from "@/lib/data"
import { BloggerInfo } from "@/lib/struct"
import { useState, useEffect } from "react"
import UserCard from "@/components/user/user-card"

/** 推荐博主 */
export default function Page() {
  const tabs = [{ val: 0, label: "热门推荐" }, { val: 1, label: "新人推荐" }, { val: 2, label: "🔥人气博主" }]
  const [type, setType] = useState<number>(0)
  const [info, setInfo] = useState<BloggerInfo[]>([])
  useEffect(() => {
    const bloggerList = async () => {
      try {
        const bloggers = await recomBlogger({ from_id: 0, page: 1, pageSize: 20, type: type })
        console.log("=====>type, 推荐博主",type, bloggers)
        setInfo(bloggers?.list||[])
      } catch (error) {
        console.error("Error fetching recommended bloggers:", error)
      }
    }
    bloggerList()
  }, [type])
  return (
    <>
      <div className="gap-3 flex justify-around mb-4">
        {tabs.map((tab) => (
          <div key={tab.val}
            className={`flex items-center justify-center ${type === tab.val ? "bg-main-pink text-white" : "bg-white"} border border-main-pink text-main-pink rounded-full px-5 py-1`}
            onClick={() => setType(tab.val)}
          >
            <span className="text-nowrap font-medium text-base">{tab.label}</span>
          </div>
        ))}
      </div>
      {info.map((item) => (
        <div key={item.id} className="w-full mb-[10px]">
          <UserCard user={item} subscribe={true}/>
        </div>
      ))}
    </>
  )
}