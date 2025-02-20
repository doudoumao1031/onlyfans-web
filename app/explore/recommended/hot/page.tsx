// app/page.tsx
import UserCard from "@/components/user/user-card"
import { BloggerInfo } from "@/lib"
import { ENDPOINTS } from "@/lib"

export const revalidate = 5

async function getHotBloggers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.RECOM.RECOM_BLOGGER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": process.env.NEXT_PUBLIC_TOKEN ?? ""
      },
      body: JSON.stringify({ from_id: 0, page: 1, pageSize: 20, type: 0 }),
      next: {
        tags: ["hot-bloggers"],
        revalidate: 5
      }
    })

    if (!res.ok) throw new Error(`API Error: ${res.status}`)
    const data = await res.json()
    return data?.data?.list || []
  } catch (error) {
    console.error("Error fetching hot bloggers:", error)
    return []
  }
}

export default async function Page() {
  const bloggers = await getHotBloggers()
  const date = new Date()
  return (
    <>
      <div className="text-center text-sm text-gray-500">
        {date.toLocaleString()}
      </div>
      {bloggers.map((item: BloggerInfo) => (
        <div key={item.id} className="w-full mb-[10px]">
          <UserCard user={item} subscribe={true} />
        </div>
      ))}
    </>
  )
}
