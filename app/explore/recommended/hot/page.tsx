import UserCard from "@/components/user/user-card"
import { BloggerInfo, getRecomBlogger } from "@/lib"

export const dynamic = "force-dynamic"

async function getHotBloggers() {
  try {
    const bloggers = await getRecomBlogger({ from_id: 0, page: 1, pageSize: 20, type: 0 })
    return bloggers?.list || []
  } catch (error) {
    console.error("Error fetching hot recommended bloggers:", error)
    return []
  }
}

export default async function Page() {
  const bloggers = await getHotBloggers()

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
