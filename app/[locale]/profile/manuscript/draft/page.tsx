"use client"
// 草稿
import React, { Fragment, useEffect, useState } from "react"


import dayjs from "dayjs"
import { useTranslations } from "next-intl"

import Image from "next/image"

import Header from "@/components/common/header"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { LazyImageWithFileId } from "@/components/common/lazy-img"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import { Link } from "@/i18n/routing"
import { myDraftPosts, PageResponse, PostData, SearchPostReq } from "@/lib"
import { ZH_YYYY_MM_DD_HH_mm_ss } from "@/lib/constant"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"


const DraftItem = ({ data }: { data: PostData }) => {
  const t = useTranslations("Profile.manuscript")
  const attachmentId = data.post_attachment?.[0]?.file_id
  return (
    <Link href={`./draft/edit?id=${data.post.id}`} className="flex gap-2.5 border-b border-[#ddd] py-2.5">
      {/*<Image src={""} alt={"img"} width={100} height={100} className="rounded"/>*/}
      <div className={"size-[100px] shrink-0 overflow-hidden"}>
        {attachmentId ? <LazyImageWithFileId fileId={attachmentId} alt={data.post.title} width={100} height={100} className={"rounded"} /> : (
          <Image src={"/icons/image_draft.png"} alt={""} width={100} height={100}
            className={"size-full shrink-0 rounded"}
          />
        )}
      </div>
      <div className="flex w-0 flex-1 flex-col justify-between">
        <div className="line-clamp-[2] text-sm font-medium">{data.post.title}</div>
        <div className="text-text-desc pb-2.5 text-xs">{t("saveAt")}：{dayjs(data.post.last_update_time * 1000).format(ZH_YYYY_MM_DD_HH_mm_ss)}</div>
      </div>
    </Link>
  )
}
export default function Page() {
  const t = useTranslations("Profile.manuscript")
  const [initData, setInitData] = useState<PageResponse<PostData>>()

  const defaultParams = {
    page: 1,
    title: "",
    pageSize: 10,
    from_id: 0,
    post_status: 0
  }
  const fetchInitData = () => {
    myDraftPosts(defaultParams).then(response => {
      if (response) {
        setInitData(response)
      }
    })
  }
  useEffect(fetchInitData, [])

  const infiniteFetchMyPosts = useInfiniteFetch<SearchPostReq, PostData>({
    fetchFn: myDraftPosts,
    params: defaultParams
  })
  return (
    <div>
      <Header title={t("draft")} titleColor={"#000"} />
      <div className="px-4">
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