import { ENDPOINTS } from "@/lib"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const params = await request.json()
  try {
    // const bloggers = await getRecomBlogger({ from_id: 0, page: 1, pageSize: 20, type: 1 })
    const bloggers = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.RECOM.RECOM_BLOGGER}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Token": process.env.NEXT_PUBLIC_TOKEN ?? ""
        },
        body: JSON.stringify(params)
      }
    ).then((res) => res.json())
    return new Response(JSON.stringify(bloggers), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Error fetching hot recommended bloggers:", error)
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
