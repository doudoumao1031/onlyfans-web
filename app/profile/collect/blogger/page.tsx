"use client"
import Empty from "@/components/common/empty"
import InfiniteScroll from "@/components/common/infinite-scroll"
import { ListEnd, ListError, ListLoading } from "@/components/explore/list-states"
import {
  BloggerInfo,
  PageResponse,
  PostData,
  userCollectionPosts,
  userCollectionUsers
} from "@/lib"
import Image from "next/image"
import { useInfiniteFetch } from "@/lib/hooks/use-infinite-scroll"
import Link from "next/link"
import { Fragment, useEffect, useState } from "react"
import { buildImageUrl, getUserDefaultBackImg } from "@/lib/utils"
import IconWithImage from "@/components/profile/icon"
import CommonAvatar from "@/components/common/common-avatar"
import SubscribedButton from "@/components/explore/subscribed-button"

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
    console.log(res, "res------")

    setInitData(res)
  }

  const infiniteFetchPosts = useInfiniteFetch({
    fetchFn: userCollectionUsers,
    params: {
      pageSize: 10,
      from_id: 0
    }
  })
  return (
    <div className="mt-4 px-4">
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
                <span className="text-gray-400">总数：</span>
                {initData?.total ?? 0}
              </div>
              {items.map((v, i) => (
                <Link key={i} href={`/space/${v.id}/feed`}>
                  <div
                    key={i}
                    className={
                      "h-28 pt-1 text-white bg-slate-400  mb-4 bg-cover rounded-lg bg-blend-multiply"
                    }
                    style={{
                      backgroundImage: v.back_img
                        ? `url(${buildImageUrl(v.back_img)})`
                        : `url(${getUserDefaultBackImg(v.username)})`
                    }}
                  >
                    <div className="text-xs min-h-4  truncate px-2">{v.top_info}</div>
                    <div className="pl-4 pr-4 pt-2 flex justify-start">
                      {/* <Image
                        src={buildImageUrl(v.photo)}
                        width={112}
                        height={112}
                        alt={"blogger photo"}
                        className={"w-16 h-16 rounded-full mr-4 border-2 border-white"}
                      /> */}
                      <div className="w-[65px] h-[65px] rounded-full mr-4 border-2 border-white overflow-hidden">
                        <CommonAvatar photoFileId={v.photo} size={64} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">
                          {v.first_name} {v.last_name}
                        </div>
                        <div className="text-xs">@{v.username}</div>
                        <div className="flex-1 flex justify-between mt-1 text-xs">
                          <div className="flex">
                            <div className="bg-black rounded-full bg-opacity-20 py-1 px-3 mr-4 text-xs flex">
                              <IconWithImage
                                url="/icons/profile/icon-photo.png"
                                width={14}
                                height={14}
                              />
                              <span className="ml-1">{v.img_count}</span>
                            </div>
                            <div className="bg-black rounded-full bg-opacity-20 py-1 px-3  mr-4 text-xs flex">
                              <IconWithImage
                                url="/icons/profile/icon-video.png"
                                width={14}
                                height={14}
                              />
                              <span className="ml-1">{v.video_count}</span>
                            </div>
                          </div>
                          {/* <div className="bg-black rounded-full bg-opacity-20 py-1 px-3 ml-2 text-xs">
                            免费/订阅
                          </div> */}
                          <div
                            onClick={(e) => {
                              e.preventDefault()
                            }}
                          >
                            <SubscribedButton
                              name={v.first_name}
                              userId={Number(v.id)}
                              subPrice={v.sub_price}
                              type={"button"}
                            />
                          </div>
                        </div>
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
