import Link from "next/link"
import { buildUserHomePagePath, getUserIdFromMention, isMention } from "./utils"

export default function Description({ content, linkRender }: { content: string, linkRender?: (content: string) => React.ReactNode }) {
  const mentionRegex = /(\B@\w+)/g
  const segments = content.split(mentionRegex)
  return (
    <div className="px-3">
      {segments.map((s, i) => (
        <DescriptionSegment key={i} content={s} linkRender={linkRender} />
      ))}
    </div>
  )
}

function DescriptionSegment({ content, linkRender }: { content: string, linkRender?: (content: string) => React.ReactNode }) {
  return isMention(content) ? (
    <Link href={buildUserHomePagePath(getUserIdFromMention(content))} className="text-[#FF8492]">
      {content}{" "}
    </Link>
  ) : (
    linkRender ? linkRender(content) : <span>{content} </span>
  )
}
