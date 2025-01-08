import { fetchFeeds } from "@/lib/data"
import FeedList from "@/components/explore/feed-list"

export default async function Page() {
    const { items, hasMore } = await fetchFeeds(1)

    return (
        <div className="container h-full w-full mx-auto">
            <FeedList initialItems={items} initialHasMore={hasMore} />
        </div>
    )
}
