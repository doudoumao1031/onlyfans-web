export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="flex h-[95vh] items-center justify-center text-2xl text-black">
      订阅管理 date: {id}
    </div>
  )
}