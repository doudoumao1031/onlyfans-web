import { postSharLog } from "@/lib"
import Stats from "./stats"

export default function Share({ count, postId }: { count: number; postId: number }) {
  return (
    <button
      onClick={() => {
        postSharLog({ post_id: postId })
      }}
    >
      <Stats icon="icon_fans_share" value={count} />
    </button>
  )
}
