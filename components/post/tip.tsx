import Stats from "./stats"
import TipDrawer from "@/components/post/tip-drawer"

export default function Tip({ count, postId }: { count: number; postId: number }) {
  return (
    <TipDrawer postId={postId}>
      <div>
        <Stats icon="icon_fans_reward" value={count} />
      </div>
    </TipDrawer>
  )
}
