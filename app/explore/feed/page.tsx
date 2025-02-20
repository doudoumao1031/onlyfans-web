import FeedList from "@/components/explore/feed-list"
import { recomActions } from "@/lib/actions"

// export const dynamic = "force-dynamic"
export const revalidate = 30

export default async function Page() {
  const { items, hasMore } = await recomActions.fetchFeeds(1)
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
    <div className="container h-full w-full mx-auto">
      <div className="text-center text-sm text-gray-500 space-y-1">
        <div>服务器生成时间: {serverTime}</div>
        <div>页面缓存时间: 30秒</div>
      </div>
      <FeedList initialItems={items} initialHasMore={hasMore} />
    </div>
  )
}
