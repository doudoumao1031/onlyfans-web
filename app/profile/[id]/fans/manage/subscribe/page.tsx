"use client"
import React, { useEffect, useState } from "react"
import TimeSort from "@/components/profile/time-sort"
import FansListItem from "@/components/profile/fans/fans-list-item"
import { getSubscribedUsers, PageResponse, SubscribeUserInfo } from "@/lib"
import InfiniteScroll, { InfiniteScrollProps } from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"

interface SubscribeUsersProps {
  initialHasMore: boolean;
  initialItems: SubscribeUserInfo[];
  fetchData: (page: number) => Promise<{ items: SubscribeUserInfo[]; hasMore: boolean; }>;
}

function SubscribeUsers({ initialItems, initialHasMore, fetchData }: SubscribeUsersProps) {
  return (
    <InfiniteScroll<SubscribeUserInfo> initialItems={initialItems}
      initialHasMore={initialHasMore}
      fetcherFn={fetchData}
    >
      {({ items, isLoading, hasMore, error }) => (
        <div>
          {Boolean(error) && <ListError/>}
          {items?.map(item => <FansListItem isSubscribe={true} data={item} key={item.user.id}/>)}
          {isLoading && <ListLoading/>}
          {!hasMore && items.length > 0 && <ListEnd/>}
        </div>
      )}
    </InfiniteScroll>
  )
}

export default function Page() {
  const fetchSubscribedUsers = async (page:number) => {
    const data = await getSubscribedUsers({ page, pageSize: 10, from_id: 0 })
    return {
      items: data?.list || [],
      hasMore: !data?.list ? false : page < Math.ceil(data.total / page)
    }
  }
  const [data,setData] = useState<PageResponse<SubscribeUserInfo> | null>(null)

  useEffect(() => {
    getSubscribedUsers({ page: 1, pageSize: 10, from_id: 0 }).then(setData)
  },[])
  if (data === null) return null

  return (
    <div className={"px-4"}>
      <div className="flex justify-between py-4 items-center">
        <span>
          <span className={"text-[#777]"}>订阅总数：</span>
          {data?.total ?? 0}
        </span>
        <TimeSort sortDesc={false}>最近订阅</TimeSort>
      </div>
      <SubscribeUsers initialHasMore={Number(data?.total) > Number(data?.list?.length)} initialItems={data?.list ?? []} fetchData={fetchSubscribedUsers}/>
    </div>
  )
}