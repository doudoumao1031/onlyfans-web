"use client"

import React, { Fragment } from "react"
import Post from "@/components/post/post"
import InfiniteScroll from "../common/infinite-scroll"
import { ListError, ListLoading, ListEnd } from "./list-states"
import { followedList, PostData } from "@/lib"
import { recomActions } from "@/lib/actions"
import Link from "next/link"
import Image from "next/image"

interface FeedListProps {
  initialItems: PostData[]
  initialHasMore: boolean
}

export default function FollowedList({ initialItems, initialHasMore }: FeedListProps) {
  return (
    <>
      <InfiniteScroll<PostData>
        initialItems={initialItems}
        initialHasMore={initialHasMore}
        fetcherFn={recomActions.followedList}
      >
        {({ items, isLoading, hasMore, error }) => (
          <Fragment>
            {Boolean(error) && <ListError />}
            <div className="max-w-lg mx-auto grid grid-cols-1 gap-4">
              {items.map((item, index) => (
                <Post key={`${item.post.id}-${index}`} data={item} hasSubscribe hasVote />
              ))}
            </div>
            {isLoading && <ListLoading />}
            {!hasMore && items.length > 0 && <ListEnd />}
          </Fragment>
        )}
      </InfiniteScroll>
      {initialItems.length === 0 && (
        <div className="flex flex-col justify-center items-center justify-items-center mt-40">
          <Image src="/icons/icon_detail_null@3x.png" alt="follow is null"
            width={200}
            height={150}
          />
          <span className="mt-6 text-gray-500 text-center">您尚未关注任何博主，快去看看
            <Link href="/explore/feed">
              <span className="text-main-pink">精彩贴文</span>
            </Link>
            吧</span>
        </div>
      )
      }
    </>

  )
}
