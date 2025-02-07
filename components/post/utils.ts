export function buildUserHomePagePath(userId: string) {
  return `/space/${userId}/feed`
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
