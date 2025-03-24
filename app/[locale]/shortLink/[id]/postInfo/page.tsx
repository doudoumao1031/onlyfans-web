import PostInfoItem from "@/components/shortLink/postInfoItem"
import { userProfile } from "@/lib/actions/profile"
import { getSelfId } from "@/lib/actions/server-actions"
import { getUserById } from "@/lib/actions/space"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = id.trim()
  console.log("space param userId", userId)
  const selfId = await getSelfId()
  const isSelf = userId === selfId
  const response = isSelf ? await userProfile() : await getUserById({ id: userId })
  const data = response?.data
  if (!data) {
    throw new Error()
  }
  return (
    <PostInfoItem data={data} />
  )
}
