import { defineRouting } from "next-intl/routing"
import { createNavigation } from "next-intl/navigation"

export const locales: string[] = ["en", "zh"]
export const defaultLocale = "en"
export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: defaultLocale
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
