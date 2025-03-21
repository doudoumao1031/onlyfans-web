import { Suspense } from "react"

import MeInfos from "@/components/profile/me-infos"
import MeInfosSkeleton from "@/components/profile/me-infos-skeleton"
import PostsCardSkeleton from "@/components/profile/posts-card-skeleton"
import PostsCards from "@/components/profile/posts-cards"
import StaticFooter from "@/components/profile/static-footer"


export const dynamic = "force-dynamic"

export default function Page() {
  return (
    <>
      <Suspense fallback={<MeInfosSkeleton />}>
        <MeInfos />
      </Suspense>
      <Suspense fallback={<PostsCardSkeleton />}>
        <PostsCards />
      </Suspense>
      <StaticFooter />
    </>
  )
}
