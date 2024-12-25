import { useEffect, useState } from "react"

export function buildUserHomePagePath(userId: string) {
  return `/${userId}`
}

export function buildUserHomePagePathForDisplay(userId: string) {
  return `secretfans.com/${userId}`
}

export function isMention(word: string) {
  return word.length > 1 && word.charAt(0) === "@"
}

export function getUserIdFromMention(mention: string) {
  return mention.substring(1)
}

export function buildMention(userId: string) {
  return `@${userId}`
}

export function useScroll() {
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    document.addEventListener("scroll", handleScroll)
    document.addEventListener("scrollend", handleScrollEnd)
    return () => {
      document.removeEventListener("scroll", handleScroll)
      document.removeEventListener("scrollend", handleScrollEnd)
    }

    function handleScroll() {
      setIsScrolling(true)
    }
    function handleScrollEnd() {
      setIsScrolling(false)
    }
  }, [])

  return isScrolling
}
