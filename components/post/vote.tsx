"use client"
import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Vote as VoteData, VoteParams } from "./types"
import { ApiResponse, fetchWithPost } from "@/lib"
import VoteSkeleton from "./vote-skeleton"
import { useTranslations } from "next-intl"

export default function Vote({ postId }: { postId: number }) {
  const t = useTranslations("Common.post")
  const [vote, setVote] = useState<VoteData>()
  const [loading, setLoading] = useState<boolean>(false)
  const { title, items, stop_time, mu_select } = vote || { items: [], stop_time: 0 }
  const [showOptionAmount, setShowOptionAmount] = useState(3)
  const selectedIds = items.filter((i) => i.select).map((i) => i.id)
  const votedByMe = items.reduce((voted, item) => item.select || voted, false)
  const secondsToExpire = stop_time - Math.floor(Date.now() / 1000)
  const totalVotes = items.reduce((t, o) => t + o.vote_count, 0)
  const canVote = secondsToExpire > 0

  const getVoteData = useCallback(async () => {
    setLoading(true)
    const response = await fetchVote(postId)
    setVote(response)
    setLoading(false)
  }, [postId])

  useEffect(() => {
    getVoteData()
  }, [getVoteData])

  return loading ? (
    <VoteSkeleton></VoteSkeleton>
  ) : (
    <div className="mt-2 flex flex-col gap-2">
      <div>{title}</div>
      <div className="flex flex-col gap-1">
        {items.slice(0, showOptionAmount).map(({ content, vote_count, id, select }) =>
          votedByMe ? (
            <div
              key={id}
              className="w-full h-11 border rounded-md px-2 flex justify-between items-center bg-no-repeat"
              style={{
                backgroundImage: `${select ? "url(/theme/blue.png)" : "url(/theme/silver.png)"}`,
                backgroundSize: `${(totalVotes ? vote_count / totalVotes : 0) * 100}% 100%`,
                borderColor: `${select ? "var(--theme)" : "var(--gray-quaternary)"}`
              }}
              onClick={() => handleClickOption(id)}
            >
              <div className="flex gap-1 h-full items-center">
                {select && <Image src="/theme/checkbox_select@3x.png" alt="" width={20} height={20} />}
                <div>{content}</div>
              </div>
              <div className={`pr-3 ${select ? "text-theme" : ""}`}>
                {vote_count} {t("votes")}
              </div>
            </div>
          ) : (
            <div
              key={id}
              className="w-full h-11 border rounded-md px-2 flex justify-center items-center"
              onClick={() => handleClickOption(id)}
            >
              <div>{content}</div>
            </div>
          )
        )}
        {showOptionAmount < items.length && (
          <div
            className="w-full h-11 border border-[#DDDDDD] rounded-md flex justify-center items-center"
            onClick={() => setShowOptionAmount(items.length)}
          >
            <div>{t("viewAllOptions")}</div>
          </div>
        )}
        <div className="mt-2 text-[#999999]">
          {t("voteCount", { count: totalVotes })}{" "}
          {canVote
            ? t("voteEndTime", { count: Math.floor(secondsToExpire / 3600) })
            : t("voteEnded")}
        </div>
      </div>
    </div>
  )

  async function handleClickOption(id: number) {
    if (!canVote) return
    if (mu_select) {
      if (selectedIds.includes(id)) {
        const success = await _vote({
          item_ids: selectedIds.filter((i) => i !== id),
          post_id: postId
        })
        if (success) {
          getVoteData()
        }
      } else {
        const success = await _vote({ item_ids: [...selectedIds, id], post_id: postId })
        if (success) {
          getVoteData()
        }
      }
    } else {
      if (selectedIds.includes(id)) {
        const success = await _vote({ item_ids: [], post_id: postId })
        if (success) {
          getVoteData()
        }
      } else {
        const success = await _vote({ item_ids: [id], post_id: postId })
        if (success) {
          getVoteData()
        }
      }
    }
  }
}

async function _vote(params: VoteParams): Promise<boolean> {
  const res = await fetchWithPost<VoteParams, ApiResponse>("/post/userVote", params)
  return !!res && res.code === 0
}

async function fetchVote(post_id: number) {
  const res = await fetchWithPost<{ post_id: number }, VoteData>("/post/getVoteInfo", {
    post_id
  })
  return res?.code === 0 ? res.data : undefined
}
