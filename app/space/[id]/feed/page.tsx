import FeedList from "@/components/explore/feed-list"
import { fetchMyPosts } from "@/lib/actions/space/actions"

export default async function Page() {
    const { items, hasMore } = await fetchMyPosts(1)

    return (
        <div className="container h-full w-full mx-auto">
            <FeedList initialItems={items} initialHasMore={hasMore} />
        </div>
    )
}
