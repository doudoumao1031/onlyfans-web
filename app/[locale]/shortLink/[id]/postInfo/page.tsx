import PostInfoItem from "@/components/shortLink/postInfoItem"
import { BloggerType, getHotBloggers, PostData } from "@/lib"
import { commonPostDetail } from "@/lib/actions/profile"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const trimId = id.trim()
  // const response = await commonGetUserById({ id: userId })
  const response = await commonPostDetail(Number(trimId))
  const data = response?.data as unknown as PostData
  if (!data) {
    throw new Error()
  }
  const bloggers = await getHotBloggers({ from_id: 0, page: 1, pageSize: 3, type: BloggerType.Hot }) ?? []
  return (
    <PostInfoItem data={data} bloggers={bloggers} />
  )
}
