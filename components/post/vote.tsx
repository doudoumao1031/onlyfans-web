import { useState } from "react"
import Image from "next/image"
import { Vote as VoteData } from "./types"
import { ApiResponse, fetchWithPost } from "@/lib"

export default function Vote({ vote, postId }: { vote: VoteData; postId: number }) {
  const { title, items, stop_time, mu_select } = vote
  const secondsToExpire = stop_time - Math.floor(Date.now()) / 1000
  const [showOptions, setShowOptions] = useState(false)
  const [showOptionAmount, setShowOptionAmount] = useState(3)
  const [voteSelectionIds, setVoteSelectionIds] = useState<number[]>([])
  const totalVotes = items.reduce((t, o) => t + o.vote_count, 0)

  const canVote = secondsToExpire > 0

  console.log(vote)

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex gap-2 items-end" onClick={() => setShowOptions((pre) => !pre)}>
        <Image src="/icons/vote.png" alt="" width={20} height={20} />
        <div className="text-red-500 text-sm">{title}</div>
        {showOptions ? (
          <Image src="/icons/arrow_up.png" alt="" width={20} height={20} />
        ) : (
          <Image src="/icons/arrow_down.png" alt="" width={20} height={20} />
        )}
      </div>
      {showOptions && (
        <div className="flex flex-col gap-1">
          {items.slice(0, showOptionAmount).map(({ content, vote_count, id }) => (
            <div
              key={id}
              className="w-full h-11 border rounded-md px-2 flex justify-between items-center bg-no-repeat"
              style={{
                backgroundImage: `${
                  !canVote || voteSelectionIds.includes(id)
                    ? "url(/icons/pink.png)"
                    : "url(/icons/silver.png)"
                }`,
                backgroundSize: `${(totalVotes ? vote_count / totalVotes : 0) * 100}% 100%`,
                borderColor: `${!canVote || voteSelectionIds.includes(id) ? "#FF8492" : "#DDDDDD"}`
              }}
              onClick={() => handleVote(id)}
            >
              <div className="flex gap-1 h-full items-center">
                {voteSelectionIds.includes(id) && (
                  <Image src="/icons/select.png" alt="" width={20} height={20} />
                )}
                <div>{content}</div>
              </div>
              <div className="pr-3">{vote_count}票</div>
            </div>
          ))}
          {showOptionAmount < items.length && (
            <div
              className="w-full h-11 border border-[#DDDDDD] rounded-md flex justify-center items-center"
              onClick={() => setShowOptionAmount(items.length)}
            >
              <div>查看全部选项</div>
            </div>
          )}
          <div className="mt-2 text-[#999999]">
            {totalVotes}人参与{" "}
            {canVote ? `还有${(secondsToExpire / 3600).toFixed(2)}小时结束` : "投票已结束"}
          </div>
        </div>
      )}
    </div>
  )

  async function handleVote(voteOptionId: number) {
    if (canVote) {
      setVoteSelectionIds(mu_select ? [...voteSelectionIds, voteOptionId] : [voteOptionId])
      const success = await _vote({ items_ids: [voteOptionId], post_id: postId })
      if (!success) setVoteSelectionIds(voteSelectionIds.filter((id) => id !== voteOptionId))
    }
  }
}

async function _vote(params: VoteParams): Promise<boolean> {
  const res = await fetchWithPost<VoteParams, ApiResponse>("/post/userVote", params)
  return !!res && res.code === 0
}

interface VoteParams {
  items_ids: number[]
  post_id: number
}
