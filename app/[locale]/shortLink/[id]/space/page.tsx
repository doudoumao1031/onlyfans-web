import SpaceItem from "@/components/shortLink/spaceItem"
import { commonGetUserById } from "@/lib/actions/space"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = id.trim()
  const response = await commonGetUserById({ id: userId })
  const data = response?.data
  if (!data) {
    throw new Error()
  }
  return (
    <SpaceItem data={data} />
  )
}
