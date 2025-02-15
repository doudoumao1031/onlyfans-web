import PostInfo from "@/components/postInfo/postInfo"
import PostInfoSkeleton from "@/components/postInfo/postInfo-skeleton"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className=" fixed top-0 left-0 w-full h-screen bg-white z-[45] overflow-auto">
      <Suspense fallback={<PostInfoSkeleton />}>
        <PostInfo id={id} />
      </Suspense>
    </div>
  )
}
