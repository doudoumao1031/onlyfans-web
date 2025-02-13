import { Skeleton } from "../ui/skeleton"

export default function Page() {
  return (
    <div className="flex w-full">
      <Skeleton className="w-[36px] h-[36px] rounded-full" />
      <div className="ml-2 flex-1 w-full mt-1">
        <div className="flex justify-between">
          <Skeleton className="w-[140px] h-[20px]" />
          <Skeleton className="w-[20px] h-[20px]" />
        </div>
        <Skeleton className="w-[80%] h-[40px] mt-2" />
        <Skeleton className="w-[36px] h-[20px] mt-2" />
      </div>
    </div>
  )
}
