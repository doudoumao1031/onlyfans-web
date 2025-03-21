import { Link } from "@/i18n/routing"
import { User } from "@/lib"

import { buildUserHomePagePath, getUserIdFromMention, isMention } from "./utils"

export default function Description({
  mentionUser,
  content,
  linkRender
}: {
  mentionUser: User[]
  content: string
  linkRender?: (content: string) => React.ReactNode
}) {
  const mentionRegex = /(\B@\w+)/g
  const segments = content.split(mentionRegex)
  return (
    <div className="whitespace-pre-wrap">
      {segments.map((s, i) => (
        <DescriptionSegment mentionUser={mentionUser} key={i} content={s} linkRender={linkRender} />
      ))}
    </div>
  )
}

function DescriptionSegment({
  mentionUser,
  content,
  linkRender
}: {
  mentionUser: User[]
  content: string
  linkRender?: (content: string) => React.ReactNode
}) {
  return isMention(content) ? (
    <Link href={buildUserHomePagePath(getUserIdFromMention(content, mentionUser))} className="text-theme">
      {content}
    </Link>
  ) : linkRender ? (
    linkRender(content)
  ) : (
    <span>{content} </span>
  )
}
