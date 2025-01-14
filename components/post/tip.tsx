import Link from "next/link"
import Stats from "./stats"

export default function Tip({ count, postId }: { count: number; postId: number }) {
  return (
    <Link scroll={false} href={`/explore/tip/${postId}`} className="flex items-center">
      <Stats icon="icon_fans_reward" value={count} />
    </Link>
  )
}
