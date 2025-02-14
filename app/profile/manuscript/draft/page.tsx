"use client"
// 草稿
import Header from "@/components/common/header"
import React, { Fragment, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { myPosts, PageResponse, PostData, SearchPostReq } from "@/lib"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import LazyImg from "@/components/common/lazy-img"
import { buildImageUrl, TIME_FORMAT } from "@/lib/utils"
import dayjs from "dayjs"

const DraftItem = ({ data }:{data:PostData}) => {
  const pathname = usePathname()
  return (
    <Link href={`${pathname}/edit?id=${data.post.id}`} className="pt-2.5 pb-2.5 border-b border-gray-100 flex gap-2.5">
      {/*<Image src={""} alt={"img"} width={100} height={100} className="rounded"/>*/}
      <div className={"w-[100px] h-[100px] shrink-0 overflow-hidden"}>
        <LazyImg src={buildImageUrl(data.post_attachment?.[0].file_id)} alt={data.post.title} width={100} height={100} className={"rounded"}/>
      </div>
      <div className="flex-col justify-between flex flex-1 w-0">
        <div className="text-[#333] line-clamp-[2] ">{data.post.title}</div>
        <div className="pb-2.5 text-xs text-[#bbb]">保存于：{dayjs(data.post.last_update_time * 1000).format(TIME_FORMAT)}</div>
      </div>
    </Link>
  )
}
export default function Page() {
  const [initData, setInitData] = useState<PageResponse<PostData>>()

  const fetchInitData = () => {
    myPosts({
      page: 1,
      title:"",
      pageSize: 10,
      from_id: 0,
      post_status: 0
    }).then(response => {
      if (response) {
        setInitData(response)
      }
    })
  }
  useEffect(fetchInitData,[])

  const infiniteFetchMyPosts = useInfiniteFetch<SearchPostReq, PostData>({
    fetchFn: myPosts,
    params: {
      pageSize: 10,
      from_id: 0
    }
  })
  return (
    <div>
      <Header title="草稿" titleColor={"#000"}/>
      <div className="pl-4 pr-4">
        {initData && (
          <InfiniteScroll<PostData> fetcherFn={infiniteFetchMyPosts} initialItems={initData.list} initialHasMore={Number(initData?.total) > Number(initData?.list?.length)}>
            {({ items, isLoading, hasMore, error }) => (
              <Fragment>
                {Boolean(error) && <ListError />}
                {items?.map((item, index) => <DraftItem data={item} key={index} />)}
                {isLoading && <ListLoading />}
                {!hasMore && items?.length > 0 && <ListEnd />}
              </Fragment>
            )}
          </InfiniteScroll>
        )}
      </div>
    </div>
  )
}