import FeedList from "@/components/explore/feed-list"
import { recomActions } from "@/lib/actions"

export const dynamic = "force-dynamic"
// export const revalidate = 3600 // Regenerate the page every 3600 seconds

export default async function Page() {
  const { items, hasMore } = await recomActions.fetchFeeds(1)
  return (
    <div className="container h-full w-full mx-auto">
      <FeedList initialItems={items} initialHasMore={hasMore}/>
    </div>
  )
}
