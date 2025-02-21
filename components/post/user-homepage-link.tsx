import Link from "next/link"
import { buildUserHomePagePath, buildUserHomePagePathForDisplay } from "./utils"

export default function UserHomePageLink({ userId, postId }: { userId: string; postId: number }) {
  return (
    <Link href={`/postInfo/${postId}`} className="text-[#FF8492] mt-[-4px]">
      {buildUserHomePagePathForDisplay(userId)}
    </Link>
  )
}
