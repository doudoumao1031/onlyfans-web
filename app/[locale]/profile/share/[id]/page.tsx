import ShareItem from "@/components/share/share-item"
import PostInfoSkeleton from "@/components/postInfo/postInfo-skeleton"
import { Suspense } from "react"
import { getSelfId } from "@/lib/actions/server-actions"
import { userProfile } from "@/lib/actions/profile"
import { getUserById } from "@/lib/actions/space"

export const dynamic = "force-dynamic"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [userId] = id.split("_")
  const selfId = await getSelfId()
  const reg = new RegExp(id)
  const isSelf = reg.test(selfId.toString())
  // const isSelf = selfId === userId
  const response = isSelf ? await userProfile() : await getUserById({ id: userId })
  const data = response?.data
  if (!data) {
    throw new Error()
  }
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-white z-[45] overflow-auto">
      <Suspense fallback={<PostInfoSkeleton />}>
        <ShareItem data={data}></ShareItem>
      </Suspense>
    </div>
  )
}
