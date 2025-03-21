import { Skeleton } from "@/components/ui/skeleton"

export default function Page() {
  return (
    <div className="p-4 ">
      <div className="flex w-full items-center justify-between">
        <div className="flex">
          <Skeleton className="size-[40px]" />
          <Skeleton className="ml-4 h-[40px] w-[222px]" />
        </div>
        <Skeleton className="h-[40px] w-[82px]" />
      </div>
      <Skeleton className="mt-4 h-[60px] w-full" />
      <Skeleton className="mt-4 h-[30px] w-[100px]" />
      <Skeleton className="mt-4 h-[200px] w-full" />
      <div className="mt-4 flex  justify-between">
        <Skeleton className="size-[40px]" />
        <Skeleton className="size-[40px]" />
        <Skeleton className="size-[40px]" />
        <Skeleton className="size-[40px]" />
        <Skeleton className="size-[40px]" />
      </div>
      <div className="flex w-full justify-center">
        <Skeleton className="mt-10 h-[40px] w-[280px]" />
      </div>
    </div>
  )
}