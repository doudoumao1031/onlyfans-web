import FeedList from "@/components/space/feed-list"
import { fetchMyPosts, fetchUserPosts } from "@/lib/actions/space/actions"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [userId, slefId] = id.split("_")
  console.log("【user_id】", userId)
  const { items, hasMore } = slefId ? await fetchMyPosts(1) : await fetchUserPosts(1)
  return (
    <div className="container h-full w-full mx-auto">
      <FeedList initialItems={items} initialHasMore={hasMore} id={userId} isSelf={!!slefId} />
    </div>
  )
}
