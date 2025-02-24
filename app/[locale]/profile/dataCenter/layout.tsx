import TabLink from "./components/tab-link"
import Header from "@/components/common/header"
export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <>
      <div className="flex h-screen flex-col w-full justify-start items-center overflow-auto">
        <div className="w-full"><Header title="数据中心" titleColor="#000" /></div>
        <TabLink />
        <div className="grow  py-3 w-full h-3/4">{children}</div>
      </div>
    </>
  )
}
