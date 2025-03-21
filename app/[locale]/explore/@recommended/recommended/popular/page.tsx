import UserCard from "@/components/user/user-card"
import { User, BloggerType } from "@/lib"
import { getPopularBloggers } from "@/lib/actions/recom/actions"

export const revalidate = 30

export default async function Page() {
  const bloggers = await getPopularBloggers({ from_id: 0, page: 1, pageSize: 20, type: BloggerType.Popular })
  return (
    <>
      {bloggers.map((item: User) => (
        <div key={item.id} className="mb-[10px] w-full">
          <UserCard user={item} />
        </div>
      ))}
    </>
  )
}
