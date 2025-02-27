import { Link } from "@/i18n/routing"
import { buildUserHomePagePath, getUserIdFromMention, isMention } from "./utils"

export default function Description({
  content,
  linkRender
}: {
  content: string
  linkRender?: (content: string) => React.ReactNode
}) {
  const mentionRegex = /(\B@\w+)/g
  const segments = content.split(mentionRegex)
  return (
    <div className="">
      {segments.map((s, i) => (
        <DescriptionSegment key={i} content={s} linkRender={linkRender} />
      ))}
    </div>
  )
}

function DescriptionSegment({
  content,
  linkRender
}: {
  content: string
  linkRender?: (content: string) => React.ReactNode
}) {
  return isMention(content) ? (
    <Link href={buildUserHomePagePath(getUserIdFromMention(content))} className="text-theme">
      {content}{" "}
    </Link>
  ) : linkRender ? (
    linkRender(content)
  ) : (
    <span>{content} </span>
  )
}
