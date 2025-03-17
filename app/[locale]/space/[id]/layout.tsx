import TabLink from "@/components/space/tab-link"
import UserInfo from "@/components/space/userInfo"
import { addSpaceLog } from "@/lib"
import { userProfile } from "@/lib/actions/profile"
import { getUserById } from "@/lib/actions/space"
import { getSelfId } from "@/lib/actions/server-actions"
export default async function Layout(props: {
  children: React.ReactNode
  modal: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const [userId] = id.split("_")
  const selfId = await getSelfId()
  const reg = new RegExp(id)
  const isSelf = reg.test(selfId.toString())
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
      <div className="flex flex-col w-full justify-start items-center">
        <UserInfo data={data} isSelf={isSelf} />
        <TabLink id={id} data={data} />
        <div className="grow px-4 py-3 w-full h-[calc(100vh-132px)]">{props.children}</div>
      </div>
      <div id="modal-root" />
    </>
  )
}
