"use client"
import React, { SyntheticEvent, useCallback, useEffect, useState } from "react"

import { useTranslations } from "next-intl"

import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { FansSubscribe } from "@/components/profile/fans/fans-list-item"
import IconWithImage from "@/components/profile/icon"
import TimeSort from "@/components/profile/time-sort"
import { FansSubscribeItems, getSubscribedUsers, PageResponse  } from "@/lib"

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
  const [name,setName] = useState<string>("")
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
    getSubscribedUsers({ page: 1, pageSize: 10, from_id: 0, desc: sortDesc , name }).then(setData)
  }

  useEffect(fetchInitData,[])

  useEffect(fetchInitData,[sortDesc])

  const handleFormSubmit = (event:SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault()
    fetchInitData()
  }
  if (data === null) return null

  return (
    <div className={"px-4"}>
      <form onSubmit={handleFormSubmit}>
        <div className="flex items-center justify-between gap-2.5 py-2">
          <div className={"flex flex-1 items-center rounded-full bg-[#F4F5F5] px-3 py-2"}>
            <IconWithImage url={"/theme/icon_search_s@3x.png"} width={18} height={18}
              color={"rgb(221, 221, 221)"}
            />
            <input value={name} placeholder={t("searchPlaceHolder")} onChange={(event) => {
              setName(event.target.value)
            }} className="flex w-full bg-transparent pl-0.5"
            />
          </div>
        </div>
      </form>
      <div className={"flex justify-end"}>
        <TimeSort sortDesc={sortDesc} handleSortChange={setSortDesc}>{t("recentSubscriptions")}</TimeSort>
      </div>
      <SubscribeUsers initialHasMore={Number(data?.total) > Number(data?.list?.length)} initialItems={data?.list ?? []} fetchData={fetchSubscribedUsers}/>
    </div>
  )
}