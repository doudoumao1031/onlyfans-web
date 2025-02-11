"use client"
import Empty from "@/components/common/empty"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { PageResponse, PostData, userCollectionPosts } from "@/lib"
import Image from "next/image"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import Link from "next/link"
import { Fragment, useEffect, useState } from "react"
import { buildImageUrl } from "@/lib/utils"



export default function Page() {
  const [initData, setInitData] = useState<PageResponse<PostData> | null>()
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
  return (
    <div className="mt-4">
      {initData && (
        <InfiniteScroll<PostData>
          className={"h-full w-full mx-auto"}
          initialItems={initData.list || []}
          initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}
          fetcherFn={infiniteFetchPosts}
        >
          {({ items, isLoading, hasMore, error }) => (
            <Fragment>
              {Boolean(error) && <ListError />}
              {items.map((v, i) => (
                <Link key={i} href={`/postInfo/${v.post.id}`}>
                  <div key={i} className={"h-28   mb-4 flex"}>
                    <Image src={buildImageUrl(v.post_attachment?.[0]?.file_id)} width={112} height={112} alt={"post image"} className={"h-28 w-28 bg-cover mr-2 shrink-0 rounded-md border border-slate-600"} />
                    <div className="flex flex-col justify-between flex-1">
                      <div className="">{v.post.title}</div>
                      <div className="flex items-center">
                        <Image src={buildImageUrl(v.user.photo)} className={"w-6 h-6 rounded-full mr-2 bg-cover "} width={24} height={24} alt={"user avatar"} />
                        <span className="text-main-pink text-xs">{v.user.username}</span>
                      </div>
                    </div>
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