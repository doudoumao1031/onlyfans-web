"use client"
import React, { Fragment, useCallback, useEffect, useState } from "react"
import TimeSort from "@/components/profile/time-sort"
import { FansFollowItem, getFollowedUsers, PageResponse } from "@/lib"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { useTranslations } from "next-intl"
import { FollowedListItem } from "@/components/profile/fans/fans-list-item"

interface FollowedUsersProps {
  initialItems: FansFollowItem[];
  initialHasMore: boolean;
  fetcherFn: (page: number) => Promise<{ items: FansFollowItem[]; hasMore: boolean; }>
}

function FollowedUsers({ initialItems, initialHasMore,fetcherFn }: FollowedUsersProps) {
  return (
    <InfiniteScroll<FansFollowItem>
      initialItems={initialItems}
      initialHasMore={initialHasMore}
      fetcherFn={fetcherFn}
    >
      {({ items, isLoading, hasMore, error }) => (
        <Fragment>
          {Boolean(error) && <ListError/>}
          {items?.map(item => <FollowedListItem data={item} key={item.user.id}/>)}
          {isLoading && <ListLoading/>}
          {!hasMore && items.length > 0 && <ListEnd/>}
        </Fragment>
      )}
    </InfiniteScroll>
  )
}

export default function Page() {
  const [data,setData] = useState<PageResponse<FansFollowItem> | null>(null)
  const [sortDesc,setSortDesc] = useState<boolean>(true)
  const t = useTranslations("Profile.fans")
  const fetcherFn = useCallback(async(page:number) => {
    const data = await getFollowedUsers({ page, pageSize: 10, from_id: 0,desc: sortDesc })
    return {
      items: data?.list || [],
      hasMore: !data?.list ? false : page < Math.ceil(data.total / page)
    }
  },[sortDesc])
  const fetchInitData = () => {
    getFollowedUsers({ page: 1, pageSize: 10, from_id: 0 ,desc: sortDesc }).then(setData)
  }
  useEffect(fetchInitData,[])

  useEffect(fetchInitData,[sortDesc])

  if (!data) return null

  return (
    <div className={"px-4"}>
      <div className="flex justify-between py-4 items-center">
        <span>
          <span className={"text-[#777]"}>{t("followTotal")}：</span>
          {data?.total}
        </span>
        <TimeSort sortDesc={sortDesc} handleSortChange={setSortDesc}>{t("followedTime")}</TimeSort>
      </div>
      {data && <FollowedUsers initialHasMore={Number(data?.total) > Number(data?.list?.length)} initialItems={data?.list ?? []} fetcherFn={fetcherFn}/>}
    </div>
  )
}