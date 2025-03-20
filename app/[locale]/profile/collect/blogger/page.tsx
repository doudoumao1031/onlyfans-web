"use client"
import Empty from "@/components/common/empty"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import {
  collecTionUser,
  PageResponse,
  User,
  userCollectionUsers
} from "@/lib"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import { Fragment, useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import UserCard from "@/components/user/user-card"
import DelItem from "@/components/profile/del-item"
import LoadingMask from "@/components/common/loading-mask"
export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [initData, setInitData] = useState<PageResponse<User> | null>()
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
  const delItem = async (collection_id: number) => {
    try {
      setIsLoading(true)
      await collecTionUser({ collection_id, collection: false })
      getData()
      setIsLoading(false)
    } catch {
      setIsLoading(false)
    }
  }
  const t = useTranslations("Profile")
  return (
    <div className="mt-4   h-[calc(100vh-145px)]">
      <LoadingMask isLoading={isLoading} />
      {initData && (
        <InfiniteScroll<User>
          className={"h-full overflow-x-hidden mx-auto"}
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
                <DelItem
                  onDelete={() => {
                    delItem(v.id)
                  }}
                  key={v.id}
                >
                  <div className="py-[5px]">
                    <UserCard user={v} />
                  </div>
                </DelItem>
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
