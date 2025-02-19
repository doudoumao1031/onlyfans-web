import Stats from "./stats"
import TipDrawer from "@/components/post/tip-drawer"
import { useState } from "react"

export default function Tip({ count, postId, self }: { count: number; postId: number, self: boolean }) {
  const [amount, setAmount] = useState<number>(count)
  const content = (
    <div>
      <Stats icon="icon_fans_reward" value={amount} disable={self}/>
    </div>
  )
  return self ? content :
    (
      <TipDrawer postId={postId} refresh={(t) => setAmount(amount + t)}>
        {content}
      </TipDrawer>
    )
}