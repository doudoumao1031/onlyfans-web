import FollowedList from "@/components/explore/followed-list"
import { recomActions } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function Page() {
  const { items, hasMore } = await recomActions.followedList(1)
  return (
    <div className="container mx-auto size-full">
      <FollowedList initialItems={items} initialHasMore={hasMore}/>
    </div>
  )
}