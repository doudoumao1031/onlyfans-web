import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { TOKEN_KEY } from "@/lib/utils"



export async function middleware(request: NextRequest) {
  const cookieStore = await cookies()
  const xToken = cookieStore.get(TOKEN_KEY)?.value

  const url = new URL(request.url)
  if (url.pathname === "/system/403" || url.pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  if (xToken) {
    return NextResponse.next()
  } else {
    if (url.pathname !== "/system/403") {
      const redirectUrl = new URL("/system/403", request.url)
      redirectUrl.searchParams.set("redirect", url.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next()
  }
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!_next/static|_next/image|.*\\.png$|api).*)"]
}