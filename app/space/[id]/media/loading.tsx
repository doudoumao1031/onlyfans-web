

export default function Loading() {
  return (
    <div className="flex mt-32 justify-center h-screen">
      {/*<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>*/}
      <img src="/icons/loading1.png" alt="loading" className={"h-16 w-16 animate-spin"} />
    </div>
  )
}