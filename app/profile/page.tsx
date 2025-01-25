
import StaticFooter from "@/components/profile/static-footer"
import PostsCards from "@/components/profile/posts-cards"
import MeInfos from "@/components/profile/me-infos"
import PostsCardSkeleton from "@/components/profile/posts-card-skeleton"
import MeInfosSkeleton from "@/components/profile/me-infos-skeleton"
import { Suspense } from "react"
export default  function Page() {
  return (
    <div>
      <Suspense fallback={<MeInfosSkeleton />}>
        <MeInfos />
      </Suspense>
      <Suspense fallback={<PostsCardSkeleton />}>
        <PostsCards />
      </Suspense>
      <StaticFooter />
    </div>
  )
}
