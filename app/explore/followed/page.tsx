import { recomActions } from "@/lib/actions"
import FollowedList from "@/components/explore/followed-list"

export default async function Page() {
  const { items, hasMore } = await recomActions.followedList(1)
  return (
    <div className="container h-full w-full mx-auto">
      <FollowedList initialItems={items} initialHasMore={hasMore}/>
    </div>
  )
}