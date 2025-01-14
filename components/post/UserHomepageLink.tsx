import Link from "next/link"
import { buildUserHomePagePath, buildUserHomePagePathForDisplay } from "./util"

export default function UserHomePageLink({ userId }: { userId: string }) {
  return (
    <Link href={buildUserHomePagePath(userId)} className="px-3 text-[#FF8492]">
      {buildUserHomePagePathForDisplay(userId)}
    </Link>
  )
}
