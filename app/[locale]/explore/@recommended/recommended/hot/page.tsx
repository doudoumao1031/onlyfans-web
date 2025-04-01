// app/explore/recommended/hot/page.tsx
import UserCard from "@/components/user/user-card"
import { User, BloggerType } from "@/lib"
import { getHotBloggers } from "@/lib/actions/recom/actions"

export const revalidate = 30

export default async function Page() {
  const bloggers = await getHotBloggers({ from_id: 0, page: 1, pageSize: 20, type: BloggerType.Hot })

  return (
    <>
      {bloggers.map((item: User) => (
        <div key={item.id} className="mb-2.5 w-full">
          <UserCard user={item} />
        </div>
      ))}
    </>
  )
}
