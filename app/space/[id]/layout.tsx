import TabLink from "@/components/space/tab-link"
import UserInfo from "@/components/space/userInfo"
import { addSpaceLog } from "@/lib"
import { userProfile } from "@/lib/actions/profile"
import { getUserById } from "@/lib/actions/space"
export default async function Layout(props: {
  children: React.ReactNode
  modal: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const [userId, slefId] = id.split("_")

  const response = !!slefId ? await userProfile() : await getUserById({ id: userId })
  if (!slefId) {
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
        <UserInfo data={data} isSelf={!!slefId} />
        <TabLink id={id} data={data} />
        <div className="grow px-4 py-3 w-full h-3/4">{props.children}</div>
      </div>
      <div id="modal-root" />
    </>
  )
}
