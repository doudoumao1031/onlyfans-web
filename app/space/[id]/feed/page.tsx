import FeedList from "@/components/explore/feed-list"
import { getMyFeeds } from "@/lib/actions/space/actions"

export default async function Page() {
    const res = await getMyFeeds({ page: 1, pageSize: 10, from_id: 1 })
    if (!res) {
        throw new Error("error")
    }
    const { list, total } = res.data

    return (
        <div className="container h-full w-full mx-auto">
            <FeedList initialItems={list} initialHasMore={total > 10} />
        </div>
    )
}
