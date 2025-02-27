import { Link } from "@/i18n/routing"
import { buildUserHomePagePath, buildUserHomePagePathForDisplay } from "./utils"

export default function UserHomePageLink({ userId, postId }: { userId: string; postId: number }) {
  return (
    <Link href={`/postInfo/${postId}`} className="text-theme mt-[-4px]">
      {buildUserHomePagePathForDisplay(userId)}
    </Link>
  )
}
