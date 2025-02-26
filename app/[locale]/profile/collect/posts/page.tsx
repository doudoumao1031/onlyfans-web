"use client"
import Empty from "@/components/common/empty"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { PageResponse, PostData, userCollectionPost, userCollectionPosts } from "@/lib"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import { Link } from "@/i18n/routing"
import { Fragment, useEffect, useState } from "react"
import { buildImageUrl } from "@/lib/utils"
import CommonAvatar from "../../../../../components/common/common-avatar"
import LazyImg from "@/components/common/lazy-img"
import DelItem from "@/components/profile/del-item"
import LoadingMask from "@/components/common/loading-mask"
import { useTranslations } from "next-intl"

export default function Page() {
  const [initData, setInitData] = useState<PageResponse<PostData> | null>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const t = useTranslations("Profile")
  useEffect(() => {
    getData()
  }, [])
  const getData = async () => {
    const params = {
      page: 1,
      pageSize: 10,
      from_id: 0
    }
    const res = await userCollectionPosts(params)
    setInitData(res)
  }

  const infiniteFetchPosts = useInfiniteFetch({
    fetchFn: userCollectionPosts,
    params: {
      pageSize: 10,
      from_id: 0
    }
  })
  const delItem = async (post_id: number) => {
    try {
      setIsLoading(true)
      await userCollectionPost({ post_id, collection: false })
      getData()
      setIsLoading(false)
    } catch {
      setIsLoading(false)
    }
  }
  return (
    <div className="mt-4 h-[calc(100vh-145px)]">
      <LoadingMask isLoading={isLoading} />
      {initData && (
        <InfiniteScroll<PostData>
          className={"h-full  overflow-x-hidden mx-auto"}
          initialItems={initData.list || []}
          initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}
          fetcherFn={infiniteFetchPosts}
        >
          {({ items, isLoading, hasMore, error }) => (
            <Fragment>
              {Boolean(error) && <ListError />}
              <div className="total-num p-4 pt-0 px-8">
                <span className="text-gray-400">{t("collect.total")}：</span>
                {initData?.total ?? 0}
              </div>
              {items.map((v) => (
                <DelItem
                  onDelete={() => {
                    delItem(v.post.id)
                  }}
                  key={v.post.id}
                >
                  <Link href={`/postInfo/${v.post.id}`}>
                    <div className={"  pt-3 pb-3 border-b border-[#e5e5e5] flex"}>
                      <div className="w-[112px] h-[112px] mr-2">
                        <LazyImg
                          src={
                            v.post_attachment?.[0]?.file_id
                              ? buildImageUrl(v.post_attachment?.[0]?.file_id)
                              : "/icons/image_draft.png"
                          }
                          width={112}
                          height={112}
                          alt={"post image"}
                          className={
                            "h-28 w-28 bg-cover  shrink-0 rounded-md border border-slate-300"
                          }
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div className="line-clamp-2">{v.post.title}</div>
                        <div className="flex items-center gap-2">
                          {/* <Image
                          src={v.user.photo?buildImageUrl(v.user.photo)}
                          className={"w-6 h-6 rounded-full mr-2 bg-cover "}
                          width={24}
                          height={24}
                          alt={"user avatar"}
                        /> */}
                          <CommonAvatar photoFileId={v.user.photo} size={24} />
                          <span className="text-text-theme text-xs">{v.user.username}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
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
