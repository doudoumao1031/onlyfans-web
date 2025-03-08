"use client"
import React, { SyntheticEvent, useCallback, useEffect, useState } from "react"
import TimeSort from "@/components/profile/time-sort"
import { FansSubscribeItems, getSubscribedUsers, PageResponse  } from "@/lib"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { useTranslations } from "next-intl"
import { FansSubscribe } from "@/components/profile/fans/fans-list-item"
import IconWithImage from "@/components/profile/icon"

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
        <div className="flex justify-between py-2 items-center gap-2.5">
          <div className={"flex-1 pt-2 pb-2 pl-3 pr-3 bg-[#F4F5F5] rounded-full flex items-center"}>
            <IconWithImage url={"/icons/profile/icon_search_s@3x.png"} width={18} height={18}
              color={"rgb(221, 221, 221)"}
            />
            <input value={name} onChange={(event) => {
              setName(event.target.value)
            }} className="w-full bg-transparent flex pl-0.5"
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