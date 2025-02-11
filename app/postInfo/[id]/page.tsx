
import PostInfo from "@/components/postInfo/postInfo"
import PostInfoSkeleton from "@/components/postInfo/postInfo-skeleton"
import MeInfosSkeleton from "@/components/profile/me-infos-skeleton"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div>
      <Suspense fallback={<PostInfoSkeleton />}>
        <PostInfo id={id} />
      </Suspense>
    </div>
  )
}
