import TabLink from "@/components/space/tab-link"
import UserInfo from "@/components/space/userInfo"
export default async function Layout(
  props: {
    children: React.ReactNode;
    modal: React.ReactNode;
    params: Promise<{ id: string }>
  }
) {
  const { id } = await props.params
  return (
    <>
      {props.modal}
      <div className="flex h-screen flex-col w-full justify-start items-center overflow-auto">
        <UserInfo id={id} />
        <TabLink id={id} />
        <div className="grow px-4 py-3 w-full h-3/4">{props.children}</div>

      </div>
      <div id="modal-root" />
    </>
  )
}
