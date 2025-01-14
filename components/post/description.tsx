import Link from "next/link"
import { buildUserHomePagePath, getUserIdFromMention, isMention } from "./util"

export default function Description({ content }: { content: string }) {
  const mentionRegex = /(\B@\w+)/g
  const segments = content.split(mentionRegex)
  return (
    <div className="px-3">
      {segments.map((s, i) => (
        <DescriptionSegment key={i} content={s} />
      ))}
    </div>
  )
}

function DescriptionSegment({ content }: { content: string }) {
  return isMention(content) ? (
    <Link href={buildUserHomePagePath(getUserIdFromMention(content))} className="text-[#FF8492]">
      {content}{" "}
    </Link>
  ) : (
    <span>{content} </span>
  )
}
