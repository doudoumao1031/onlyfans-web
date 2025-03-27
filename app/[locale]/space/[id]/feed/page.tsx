"use client"

import React, { useEffect, useState } from "react"

import { useParams } from "next/navigation"

import Empty from "@/components/common/empty"
import FeedList from "@/components/space/feed-list"
import { PageResponse, PostData } from "@/lib"
import { getUserPosts } from "@/lib/actions/space"

type FeedParams = {
  user_id: number
  post_status?: number
  page: number
  pageSize: number
  from_id: number
}

export default function SpaceFeedPage() {
  const [initData, setInitData] = useState<PageResponse<PostData> | null>()
  const { id } = useParams()

  useEffect(() => {
    getUserPosts({
      page: 1,
      pageSize: 10,
      from_id: 0,
      user_id: Number(id),
      post_status: 1
    } as FeedParams).then(res => {
      setInitData(res)
    })
  }, [id])

  return (
    <div className="size-full">
      {initData ? (
        <FeedList
          initialItems={initData.list || []}
          initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}
          id={id as string}
          isSelf={false}
        />
      ) : (
        <Empty top={20} />
      )}
    </div>
  )
}
