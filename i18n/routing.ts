import { createNavigation } from "next-intl/navigation"
import { defineRouting } from "next-intl/routing"

export const locales: string[] = ["en", "zh"]
export const defaultLocale = "zh"
export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: defaultLocale
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
