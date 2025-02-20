import UserCard from "@/components/user/user-card"
import { BloggerInfo } from "@/lib"

export const revalidate = 10
// export const dynamic = "force-dynamic"
async function getHotBloggers() {
  try {
    const res = await fetch("http://localhost:3000/api/explore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ from_id: 0, page: 1, pageSize: 20, type: 0 })
    }).then((res) => res.json())

    return res?.data?.list || []
  } catch (error) {
    console.error("Error fetching hot recommended bloggers:", error)
    return []
  }
}

export default async function Page() {
  const bloggers = await getHotBloggers()
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
