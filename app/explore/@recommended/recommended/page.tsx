"use client"
import { useState, useEffect } from "react"
import UserCard from "@/components/user/user-card"
import { BloggerInfo, getRecomBlogger } from "@/lib"

/** 推荐博主 */
export default function Page() {
  const tabs = [{ val: 0, label: "热门推荐" }, { val: 1, label: "新人推荐" }, { val: 2, label: "🔥人气博主" }]
  const [type, setType] = useState<number>(0)
  const [info, setInfo] = useState<BloggerInfo[]>([])
  useEffect(() => {
    const bloggerList = async () => {
      try {
        const bloggers = await getRecomBlogger({ from_id: 0, page: 1, pageSize: 20, type: type })
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
      {/* {info.map((item) => (
        <div key={item.id} className="w-full mb-[10px]">
          <UserCard user={item} subscribe={true}/>
        </div>
      ))} */}
      blank
    </>
  )
}