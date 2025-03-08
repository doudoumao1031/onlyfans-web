"use client"
import React, { useCallback, useEffect, useState } from "react"
import TimeSort from "@/components/profile/time-sort"
import { FansSubscribeItems, getSubscribedUsers, PageResponse  } from "@/lib"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { useTranslations } from "next-intl"
import { FansSubscribe } from "@/components/profile/fans/fans-list-item"

interface SubscribeUsersProps {
  initialHasMore: boolean;
  initialItems: FansSubscribeItems[];
  fetchData: (page: number) => Promise<{ items: FansSubscribeItems[]; hasMore: boolean; }>;
}

function SubscribeUsers({ initialItems, initialHasMore, fetchData }: SubscribeUsersProps) {
  return (
    <InfiniteScroll<FansSubscribeItems> initialItems={initialItems}
      initialHasMore={initialHasMore}
      fetcherFn={fetchData}
    >
      {({ items, isLoading, hasMore, error }) => (
        <div>
          {Boolean(error) && <ListError/>}
          {items?.map(item => <FansSubscribe data={item} key={item.user.id}/>)}
          {isLoading && <ListLoading/>}
          {!hasMore && items.length > 0 && <ListEnd/>}
        </div>
      )}
    </InfiniteScroll>
  )
}

export default function Page() {
  const [data,setData] = useState<PageResponse<FansSubscribeItems> | null>(null)
  const [sortDesc,setSortDesc] = useState<boolean>(true)
  const t = useTranslations("Profile.fans")
  const fetchSubscribedUsers = useCallback(async (page:number) => {
    const data = await getSubscribedUsers({ page, pageSize: 10, from_id: 0,desc: sortDesc })
    return {
      items: data?.list || [],
      hasMore: !data?.list ? false : page < Math.ceil(data.total / page)
    }
  },[sortDesc])

  const fetchInitData = () => {
    getSubscribedUsers({ page: 1, pageSize: 10, from_id: 0, desc: sortDesc }).then(setData)
  }

  useEffect(fetchInitData,[])

  useEffect(fetchInitData,[sortDesc])

  if (data === null) return null

  return (
    <div className={"px-4"}>
      <div className="flex justify-between py-4 items-center">
        <span>
          <span className={"text-[#777]"}>{t("subTotal")}：</span>
          {data?.total ?? 0}
        </span>
        <TimeSort sortDesc={sortDesc} handleSortChange={setSortDesc}>{t("recentSubscriptions")}</TimeSort>
      </div>
      <SubscribeUsers initialHasMore={Number(data?.total) > Number(data?.list?.length)} initialItems={data?.list ?? []} fetchData={fetchSubscribedUsers}/>
    </div>
  )
}