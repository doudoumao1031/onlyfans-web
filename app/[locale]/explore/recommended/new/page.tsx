// app/explore/recommended/hot/page.tsx
import UserCard from "@/components/user/user-card"
import { BloggerInfo, BloggerType } from "@/lib"
import { getNewBloggers } from "@/lib/actions/recom/actions"

export const revalidate = 30

export default async function Page() {
  const bloggers = await getNewBloggers({
    from_id: 0,
    page: 1,
    pageSize: 20,
    type: BloggerType.New
  })

  return (
    <>
      {bloggers.map((item: BloggerInfo) => (
        <div key={item.id} className="w-full mb-[10px]">
          <UserCard user={item} subscribe={true} />
        </div>
      ))}
    </>
  )
}
