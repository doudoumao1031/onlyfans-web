"use client"
import React, { Fragment, SyntheticEvent, useCallback, useEffect, useState } from "react"

import { useTranslations } from "next-intl"

import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { FollowedListItem } from "@/components/profile/fans/fans-list-item"
import IconWithImage from "@/components/profile/icon"
import TimeSort from "@/components/profile/time-sort"
import { FansFollowItem, getFollowedUsers, PageResponse } from "@/lib"

interface FollowedUsersProps {
  initialItems: FansFollowItem[];
  initialHasMore: boolean;
  fetcherFn: (page: number) => Promise<{ items: FansFollowItem[]; hasMore: boolean; }>
}

function FollowedUsers({ initialItems, initialHasMore, fetcherFn }: FollowedUsersProps) {
  return (
    <InfiniteScroll<FansFollowItem>
      initialItems={initialItems}
      initialHasMore={initialHasMore}
      fetcherFn={fetcherFn}
    >
      {({ items, isLoading, hasMore, error }) => (
        <Fragment>
          {Boolean(error) && <ListError />}
          {items?.map(item => <FollowedListItem data={item} key={item.user.id} />)}
          {isLoading && <ListLoading />}
          {!hasMore && items.length > 0 && <ListEnd />}
        </Fragment>
      )}
    </InfiniteScroll>
  )
}

export default function Page() {
  const [data, setData] = useState<PageResponse<FansFollowItem> | null>(null)
  const [sortDesc, setSortDesc] = useState<boolean>(true)
  const [name, setName] = useState<string>("")
  const t = useTranslations("Profile.fans")
  const fetcherFn = useCallback(async (page: number) => {
    const data = await getFollowedUsers({ page, pageSize: 10, from_id: 0, desc: sortDesc })
    return {
      items: data?.list || [],
      hasMore: !data?.list ? false : page < Math.ceil(data.total / page)
    }
  }, [sortDesc])
  const fetchInitData = () => {
    getFollowedUsers({ page: 1, pageSize: 10, from_id: 0, desc: sortDesc, name }).then(setData)
  }
  useEffect(fetchInitData, [])

  useEffect(fetchInitData, [sortDesc])

  const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault()
    fetchInitData()
  }
  if (!data) return null

  return (
    <div className={"px-4"}>
      <form onSubmit={handleFormSubmit}>
        <div>
          <div className={"mt-2 flex flex-1 items-center rounded-full bg-[#F4F5F5] px-3 py-2"}>
            <IconWithImage url={"/theme/icon_search_s@3x.png"} width={18} height={18}
              color={"rgb(221, 221, 221)"}
            />
            <input value={name} placeholder={t("searchPlaceHolder")} onChange={(event) => {
              setName(event.target.value)
            }} className="flex w-full bg-transparent pl-0.5"
            />
          </div>
        </div>
        <div className="flex items-center justify-between py-4 text-sm">
          <span>
            <span className={"text-[#777]"}>{t("followTotal")}：</span>
            {data?.total}
          </span>
          <TimeSort sortDesc={sortDesc} handleSortChange={setSortDesc}>{t("followedTime")}</TimeSort>
        </div>
      </form>

      {data && <FollowedUsers initialHasMore={Number(data?.total) > Number(data?.list?.length)} initialItems={data?.list ?? []} fetcherFn={fetcherFn} />}
    </div>
  )
}