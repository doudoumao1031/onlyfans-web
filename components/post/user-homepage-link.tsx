import Link from "next/link"
import { buildUserHomePagePath, buildUserHomePagePathForDisplay } from "./utils"

export default function UserHomePageLink({ userId, postId }: { userId: string; postId: number }) {
  return (
    <Link href={`/postInfo/${postId}`} className="px-3 text-[#FF8492]">
      {buildUserHomePagePathForDisplay(userId)}
    </Link>
  )
}
