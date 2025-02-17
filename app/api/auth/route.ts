import { cookies } from "next/headers"
import { TOKEN_KEY } from "@/lib/utils"


export async function POST () {
  const cookieStore = await cookies()
  cookieStore.set({
    name: TOKEN_KEY,
    value: "25",
    httpOnly: true,
    path: "/"
  })
  return new Response( JSON.stringify({ code: 0,message:"登录成功" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
}