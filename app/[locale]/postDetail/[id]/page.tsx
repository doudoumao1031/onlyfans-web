import { Suspense } from "react"

import PostInfoItem from "@/components/postInfo/postInfo-item"
import PostInfoSkeleton from "@/components/postInfo/postInfo-skeleton"
import { addPostLog, PostData } from "@/lib"
import { postDetail } from "@/lib/actions/profile"

export const dynamic = "force-dynamic"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
   addPostLog(Number(id))
  const res = await postDetail(Number(id))
  const result = res?.data as unknown as PostData
  if (res?.message === "POST_NOT_FOUND") {
    throw new Error("POST_NOT_FOUND")
  }
  return (
    <div className="fixed left-0 top-0 z-[45] h-screen w-full overflow-auto bg-white">
      <Suspense fallback={<PostInfoSkeleton />}>
        <PostInfoItem postData={result}></PostInfoItem>
      </Suspense>
    </div>
  )
}
