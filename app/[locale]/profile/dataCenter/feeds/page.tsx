"use client"
import { Fragment, useEffect, useMemo, useState } from "react"

import { useTranslations } from "next-intl"

import Empty from "@/components/common/empty"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import FeedItem from "@/components/profile/dataCenter/feedItem"
import InputWithLabel from "@/components/profile/input-with-label"
import { Link } from "@/i18n/routing"
import { PageResponse, PostData } from "@/lib"
import { getMyFeeds } from "@/lib/actions/space"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"



export default function Page() {
  const [initData, setInitData] = useState<PageResponse<PostData> | null>()
  const [type, setType] = useState<number>(0)
  const t = useTranslations("Profile")
  useEffect(() => {
    getMyFeeds({
      page: 1,
      pageSize: 10,
      from_id: 0,
      sort_type: type
    }).then((res) => {
      setInitData(res)
    })
  }, [type])
  const filterTypes = useMemo(() => {
    return [
      { label: t("dataCenter.latestRelease"), value: 0 },
      { label: t("dataCenter.totalPlayCount"), value: 1 },
      { label: t("dataCenter.totalComment"), value: 2 },
      { label: t("dataCenter.totalLike"), value: 3 }
    ]
  }, [t])

  const title = useMemo(() => {
    const cur = filterTypes.find((v) => v.value === type)
    return cur ? cur.label : t("dataCenter.latestRelease")
  }, [filterTypes, t, type])

  const infiniteFetchPosts = useInfiniteFetch({
    fetchFn: getMyFeeds,
    params: {
      pageSize: 10,
      from_id: 0,
      sort_type: type
    }
  })
  return (
    <div className="h-[calc(100vh-148px)] w-full">
      {initData && (
        <InfiniteScroll<PostData>
          className={"mx-auto size-full"}
          initialItems={initData.list || []}
          initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}
          fetcherFn={infiniteFetchPosts}
        >
          {({ items, isLoading, hasMore, error }) => (
            <Fragment>
              {Boolean(error) && <ListError />}
              <div className="mb-4 flex justify-between px-4">
                <div className="flex items-end">
                  <h1 className="text-base font-medium">{t("dataCenter.posts")}</h1>
                  <div className="ml-2 text-xs text-[#BBB] ">{`${t("dataCenter.show")}${title}${t("dataCenter.recent")}`}</div>
                </div>
                <InputWithLabel
                  placeholder={t("dataCenter.dateRange")}
                  labelClass="border-0 pl-0 pr-0 pb-0 pt-[0px] text-[#6D7781]"
                  iconSize={16}
                  onInputChange={(e) => {
                    setType(e as number)
                  }}
                  options={filterTypes}
                  value={type}
                />
              </div>
              {items.map((v, i) => (
                <Link key={i} href={`/postInfo/${v.post.id}`}>
                  <FeedItem key={i} item={v} />
                </Link>
              ))}
              {isLoading && <ListLoading />}
              {!hasMore && items?.length > 0 && <ListEnd />}
              {(!items || !items?.length) && <Empty top={20} />}
            </Fragment>
          )}
        </InfiniteScroll>
      )}
    </div>
  )
}
