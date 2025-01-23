"use client"
import React, { Fragment, useEffect, useState } from "react"
import TimeSort from "@/components/profile/time-sort"
import { getFollowedUsers, infiniteGetFollowedUsers, PageResponse, SubscribeUserInfo } from "@/lib"
import InfiniteScroll, { InfiniteScrollProps } from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import FansListItem from "@/components/profile/fans/fans-list-item"

interface FollowedUsersProps {
  initialItems: SubscribeUserInfo[];
  initialHasMore: boolean;
}

function FollowedUsers({ initialItems, initialHasMore }: FollowedUsersProps) {

  return (
    <InfiniteScroll<SubscribeUserInfo>
      initialItems={initialItems}
      initialHasMore={initialHasMore}
      fetcherFn={infiniteGetFollowedUsers}
    >
      {({ items, isLoading, hasMore, error }) => (
        <Fragment>
          {Boolean(error) && <ListError/>}
          {items?.map(item => <FansListItem data={item} key={item.user.id}/>)}
          {isLoading && <ListLoading/>}
          {!hasMore && items.length > 0 && <ListEnd/>}
        </Fragment>
      )}
    </InfiniteScroll>
  )
}

export default function Page() {
  const [data,setData] = useState<PageResponse<SubscribeUserInfo> | null>(null)
  useEffect(() => {
    getFollowedUsers({ page: 1, pageSize: 10, from_id: 0 }).then(setData)
  },[])

  if (!data) return null

  return (
    <div className={"px-4"}>
      <div className="flex justify-between py-4 items-center">
        <span>
          <span className={"text-[#777]"}>关注总数：</span>
          {data?.total}
        </span>
        <TimeSort sortDesc={false}>关注时间升序</TimeSort>
      </div>
      {data && <FollowedUsers initialHasMore={Number(data?.total) > Number(data?.list?.length)} initialItems={data?.list ?? []}/>}
    </div>
  )
}