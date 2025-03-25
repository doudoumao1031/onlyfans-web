import SpaceItem from "@/components/shortLink/spaceItem"
import { BloggerType, getHotBloggers } from "@/lib"
import { commonGetUserById } from "@/lib/actions/space"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = id.trim()
  const response = await commonGetUserById({ id: userId })
  const data = response?.data
  if (!data) {
    throw new Error()
  }
  const bloggers = await getHotBloggers({ from_id: 0, page: 1, pageSize: 3, type: BloggerType.Hot }) ?? []
  return (
    <SpaceItem data={data} bloggers={bloggers} />
  )
}
