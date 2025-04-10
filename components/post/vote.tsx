"use client"
import { useCallback, useEffect, useState } from "react"

import { useTranslations } from "next-intl"

import Image from "next/image"


import { ApiResponse, fetchWithPost } from "@/lib"

import { Vote as VoteData, VoteParams } from "./types"
import VoteSkeleton from "./vote-skeleton"


export default function Vote({ postId }: { postId: number }) {
  const t = useTranslations("Common.post")
  const [vote, setVote] = useState<VoteData>()
  const [loading, setLoading] = useState<boolean>(false)
  const { title, items, stop_time, mu_select, vote_user_count } = vote || {
    items: [],
    stop_time: 0
  }
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
              className="flex h-11 w-full items-center justify-between gap-2 rounded-md border bg-no-repeat px-2"
              style={{
                backgroundImage: `${select ? "url(/theme/blue.png)" : "url(/theme/silver.png)"}`,
                backgroundSize: `${(totalVotes ? vote_count / totalVotes : 0) * 100}% 100%`,
                borderColor: `${select ? "var(--theme)" : "var(--gray-quaternary)"}`
              }}
              onClick={() => handleClickOption(id)}
            >
              <div className="flex h-full items-center gap-1 truncate">
                {select && (
                  <Image src="/theme/checkbox_select@3x.png" alt="" width={20} height={20} />
                )}
                <div className="truncate">{content}</div>
              </div>
              <div className={`pr-3 ${select ? "text-theme" : ""} whitespace-nowrap`}>
                {vote_count} {t("votes")}
              </div>
            </div>
          ) : (
            <div
              key={id}
              className="flex h-11 w-full items-center justify-center rounded-md border px-2"
              onClick={() => handleClickOption(id)}
            >
              <div className="truncate">{content}</div>
            </div>
          )
        )}
        {showOptionAmount < items.length && (
          <div
            className="flex h-11 w-full items-center justify-center rounded-md border border-[#DDDDDD]"
            onClick={() => setShowOptionAmount(items.length)}
          >
            <div>{t("viewAllOptions")}</div>
          </div>
        )}
        <div className="mt-2 text-[#999999]">
          {t("voteCount", { count: vote_user_count })}{" "}
          {canVote
            ? secondsToExpire > 3600
              ? t("voteEndTimeHours", { count: Math.floor(secondsToExpire / 3600) })
              : t("voteEndTimeMinutes", { count: Math.floor(secondsToExpire / 60) })
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
