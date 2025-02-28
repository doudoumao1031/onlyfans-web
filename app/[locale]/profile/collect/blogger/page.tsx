"use client"
import Empty from "@/components/common/empty"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import {
  BloggerInfo,
  PageResponse,
  userCollectionUsers
} from "@/lib"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import { Link } from "@/i18n/routing"
import { Fragment, useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import UserCard from "@/components/user/user-card"
export default function Page() {
  const [initData, setInitData] = useState<PageResponse<BloggerInfo> | null>()
  useEffect(() => {
    getData()
  }, [])
  const getData = async () => {
    const params = {
      page: 1,
      pageSize: 10,
      from_id: 0
    }
    const res = await userCollectionUsers(params)
    setInitData(res)
  }

  const infiniteFetchPosts = useInfiniteFetch({
    fetchFn: userCollectionUsers,
    params: {
      pageSize: 10,
      from_id: 0
    }
  })
  const t = useTranslations("Profile")
  return (
    <div className="mt-4 px-4  h-[calc(100vh-145px)]">
      {initData && (
        <InfiniteScroll<BloggerInfo>
          className={"h-full w-full mx-auto"}
          initialItems={initData.list || []}
          initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}
          fetcherFn={infiniteFetchPosts}
        >
          {({ items, isLoading, hasMore, error }) => (
            <Fragment>
              {Boolean(error) && <ListError />}
              <div className="total-num p-4 pt-0">
                <span className="text-gray-400">{t("collect.total")}：</span>
                {initData?.total ?? 0}
              </div>
              {items.map((v, i) => (
                <Link key={i} href={`/space/${v.id}/feed`}>
                  <div className={"w-full mb-[10px]"}>
                    <UserCard user={v} subscribe={true} />
                  </div>
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
