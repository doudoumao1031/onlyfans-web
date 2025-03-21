"use client"
import { Fragment, useEffect, useState } from "react"

import { useTranslations } from "next-intl"

import Empty from "@/components/common/empty"
import InfiniteScroll from "@/components/common/infinite-scroll"
import LazyImg from "@/components/common/lazy-img"
import LoadingMask from "@/components/common/loading-mask"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import DelItem from "@/components/profile/del-item"
import { Link } from "@/i18n/routing"
import { PageResponse, PostData, userCollectionPost, userCollectionPosts } from "@/lib"
import { useGlobal } from "@/lib/contexts/global-context"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import { buildImageUrl } from "@/lib/utils"

import CommonAvatar from "../../../../../components/common/common-avatar"


export default function Page() {
  const [initData, setInitData] = useState<PageResponse<PostData> | null>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { sid } = useGlobal()
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
          className={"mx-auto  h-full overflow-x-hidden"}
          initialItems={initData.list || []}
          initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}
          fetcherFn={infiniteFetchPosts}
        >
          {({ items, isLoading, hasMore, error }) => (
            <Fragment>
              {Boolean(error) && <ListError />}
              <div className="total-num p-4 px-8 pt-0">
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
                    <div className={"  flex gap-2 border-b border-[#e5e5e5] py-3"}>
                      <div className="relative size-[112px] shrink-0">
                        <LazyImg
                          src={
                            v.post_attachment?.[0]?.thumb_id || v.post_attachment?.[0]?.file_id
                              ? buildImageUrl(v.post_attachment?.[0]?.thumb_id || v.post_attachment?.[0]?.file_id)
                              : "/icons/image_draft.png"
                          }
                          width={112}
                          height={112}
                          alt={"post image"}
                          className={
                            "size-28 shrink-0 rounded-md  border border-slate-300 bg-cover"
                          }
                        />
                        {(v.post.visibility !== 0 && v.user.id !== sid) && (
                          <div className="absolute left-0 top-0 z-0 size-full rounded-lg bg-black bg-opacity-5 backdrop-blur"></div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="line-clamp-3">{v.post.title}</div>
                        <div className="flex items-center gap-2">
                          <CommonAvatar photoFileId={v.user.photo} size={24} />
                          <span className="text-text-theme w-5/12 truncate text-xs ">{`${v.user.first_name} ${v.user.last_name}`}</span>
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
