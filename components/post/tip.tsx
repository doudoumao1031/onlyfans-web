import Stats from "./stats"
import TipDrawer from "@/components/post/tip-drawer"
import { useState } from "react"
interface TipProps {
  count: number
  postId: number
  self: boolean
  tipStar: (star: boolean) => void
}

export default function Tip(props: TipProps) {
  const { count, postId, self, tipStar } = props
  const [amount, setAmount] = useState<number>(count)
  const content = (
    <div>
      <Stats icon="icon_fans_reward" value={amount} disable={self}/>
    </div>
  )
  return self ? content :
    (
      <TipDrawer postId={postId} refresh={(t) => setAmount(amount + t)} tipStar={tipStar}>
        {content}
      </TipDrawer>
    )
}