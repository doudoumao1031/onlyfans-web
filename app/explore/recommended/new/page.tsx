import UserCard from "@/components/user/user-card"
import { BloggerInfo, getRecomBlogger } from "@/lib"

async function getNewBloggers() {
  try {
    const bloggers = await getRecomBlogger({ from_id: 0, page: 1, pageSize: 20, type: 1 })
    return bloggers?.list || []
  } catch (error) {
    console.error("Error fetching new recommended bloggers:", error)
    return []
  }
}

export default async function Page() {
  const bloggers = await getNewBloggers()

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
