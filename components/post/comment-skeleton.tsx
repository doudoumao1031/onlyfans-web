import { Skeleton } from "../ui/skeleton"

export default function Page() {
  return (
    <div className="flex w-full">
      <Skeleton className="size-[36px] rounded-full" />
      <div className="ml-2 mt-1 w-full flex-1">
        <div className="flex justify-between">
          <Skeleton className="h-[20px] w-[140px]" />
          <Skeleton className="size-[20px]" />
        </div>
        <Skeleton className="mt-2 h-[40px] w-4/5" />
        <Skeleton className="mt-2 h-[20px] w-[36px]" />
      </div>
    </div>
  )
}
