
import StaticFooter from "@/components/profile/static-footer"
import PostsCards from "@/components/profile/posts-cards"
import MeInfos from "@/components/profile/me-infos"
import PostsCardSkeleton from '@/components/profile/posts-card-skeleton'
import MeInfosSkeleton from "@/components/profile/me-infos-skeleton"
import { Suspense } from "react"
export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div>
      <Suspense fallback={<MeInfosSkeleton />}>
        <MeInfos id={id} />
      </Suspense>
      <Suspense fallback={<PostsCardSkeleton />}>
        <PostsCards id={id} />
      </Suspense>
      <StaticFooter id={id} />
    </div>
  )
}
