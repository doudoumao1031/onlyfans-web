import PostInfoItem from "@/components/postInfo/postInfo-item"
import PostInfoSkeleton from "@/components/postInfo/postInfo-skeleton"
import { addPostLog, PostData } from "@/lib"
import { postDetail } from "@/lib/actions/profile"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await addPostLog(Number(id))
  const res = await postDetail(Number(id))
  const result = res?.data as unknown as PostData
  if (res?.message === "POST_NOT_FOUND") {
    throw new Error('POST_NOT_FOUND')
  }
  return (
    <div className=" fixed top-0 left-0 w-full h-screen bg-white z-[45] overflow-auto">
      <Suspense fallback={<PostInfoSkeleton />}>
        <PostInfoItem postData={result}></PostInfoItem>
      </Suspense>
    </div>
  )
}
