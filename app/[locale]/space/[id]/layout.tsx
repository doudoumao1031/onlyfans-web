import TabLink from "@/components/space/tab-link"
import UserInfo from "@/components/space/userInfo"
import { addSpaceLog } from "@/lib"
import { userProfile } from "@/lib/actions/profile"
import { getSelfId } from "@/lib/actions/server-actions"
import { getUserById } from "@/lib/actions/space"

export default async function Layout(props: {
  children: React.ReactNode
  modal: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const userId = id.trim()
  console.log("space param userId", userId)
  const selfId = await getSelfId()
  console.log("space selfId", selfId)
  const isSelf = userId === selfId
  console.log("space isSelf", isSelf)
  // const isSelf = selfId === userId
  const response = isSelf ? await userProfile() : await getUserById({ id: userId })
  if (!isSelf) {
    await addSpaceLog(Number(userId))
  }
  const data = response?.data
  if (!data) {
    throw new Error()
  }
  return (
    <>
      {props.modal}
      <div className="flex w-full flex-col items-center justify-start">
        <UserInfo data={data} isSelf={isSelf} />
        <TabLink id={id} data={data} />
        <div className="h-[calc(100vh-132px)] w-full grow px-4 py-3">{props.children}</div>
      </div>
      <div id="modal-root" />
    </>
  )
}
