// app/explore/recommended/hot/page.tsx
import UserCard from "@/components/user/user-card"
import { BloggerInfo, BloggerType } from "@/lib"
import { getHotBloggers } from "@/lib/actions/recom/actions"

export const revalidate = 30

export default async function Page() {
  const bloggers = await getHotBloggers({ from_id: 0, page: 1, pageSize: 20, type: BloggerType.Hot })
  const serverTime = new Date().toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  })

  return (
    <>
      <div className="text-center text-sm text-gray-500 space-y-1">
        <div>服务器生成时间: {serverTime}</div>
        <div>页面缓存时间: 30秒</div>
      </div>
      {bloggers.map((item: BloggerInfo) => (
        <div key={item.id} className="w-full mb-[10px]">
          <UserCard user={item} subscribe={true} />
        </div>
      ))}
    </>
  )
}
