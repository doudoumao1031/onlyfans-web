import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { TOKEN_KEY } from "@/lib/utils"
import createMiddleware from "next-intl/middleware"
import { defaultLocale, locales, routing } from "@/i18n/routing"

const handleI18nRouting = createMiddleware(routing)

const checkPathIsInLocale = (path: string) => {
  return locales.some((item) => {
    return path.startsWith(`/${item}`)
  })
}

const isUnauthorizedPath = (locale: string, path: string) => {
  return `/${locale}/system/403` === path
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const [, locale] = pathname.split("/")
  const cookieStore = await cookies()
  const xToken = cookieStore.get(TOKEN_KEY)?.value
  const hasLocale = checkPathIsInLocale(pathname)
  if (!hasLocale) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = `/${defaultLocale}/${pathname}`
    return NextResponse.redirect(redirectUrl)
  }
  const pathValidation = isUnauthorizedPath(locale, pathname)
  const url = new URL(request.url)

  if (pathValidation || url.pathname.startsWith("/api")) {
    return handleI18nRouting(request)
  }

  if (xToken) {
    return handleI18nRouting(request)
    // return NextResponse.next()
  } else {
    if (!pathValidation) {
      const redirectUrl = new URL(`/${locale}/system/403`, request.url)
      redirectUrl.searchParams.set("redirect", url.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return handleI18nRouting(request)
  }
}

export const config = {
  matcher: [
    "/",
    "/(zh|en)/:path*",
    "/((?!_next|static|.*\\.\\w+$|api).*)"]
}
