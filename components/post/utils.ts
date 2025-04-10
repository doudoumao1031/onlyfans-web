import { User } from "@/lib"

export function buildUserHomePagePath(userId: number) {
  return userId ? `/space/${userId}/feed` : "/explore/feed"
}

export function buildUserHomePagePathForDisplay(userId: string) {
  return `secretfans.com/${userId}`
}

export function isMention(word: string) {
  return word.length > 1 && word.charAt(0) === "@"
}

export function getUserIdFromMention(mention: string, mentionUser: User[]) {
  const name = mention.substring(1)
  const curUser = (mentionUser || []).find((v) => v.username === name)
  return curUser ? curUser.id : 0
}

export function buildMention(userId: string) {
  return userId ? `@${userId}` : "\u00A0"
}
