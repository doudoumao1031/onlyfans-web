export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      {/*<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>*/}
      <img src="/icons/loading1.png" alt="loading" className={"h-16 w-16 animate-spin"}/>
    </div>
  )
}