import Header from "@/components/explore/recommended/header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto flex size-full max-w-lg flex-col items-center justify-start">
        <Header />
        <div className="hide-scrollbar h-3/4 w-full grow overflow-y-auto py-3">{children}</div>
      </div>
    </>
  )
}
