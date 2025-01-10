import UserCard from "@/components/user/user-card"
import { BloggerInfo, getRecomBlogger } from "@/lib"

async function getPopularBloggers() {
  try {
    const bloggers = await getRecomBlogger({ from_id: 0, page: 1, pageSize: 20, type: 2 })
    return bloggers?.list || []
  } catch (error) {
    console.error("Error fetching popular bloggers:", error)
    return []
  }
}

export default async function Page() {
  const bloggers = await getPopularBloggers()

  return (
    <>
      {bloggers.map((item) => (
        <div key={item.id} className="w-full mb-[10px]">
          <UserCard user={item} subscribe={true}/>
        </div>
      ))}
    </>
  )
}
