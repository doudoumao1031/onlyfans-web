import { Skeleton } from "@/components/ui/skeleton"
export default function Page() {
  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center w-full">
        <div className="flex">
          <Skeleton className="h-[40px] w-[40px]" />
          <Skeleton className="h-[40px] w-[222px] ml-4" />
        </div>
        <Skeleton className="h-[40px] w-[82px]" />
      </div>
      <Skeleton className="h-[60px] w-full mt-4" />
      <Skeleton className="h-[30px] w-[100px] mt-4" />
      <Skeleton className="h-[200px] w-full mt-4" />
      <div className="flex justify-between  mt-4">
        <Skeleton className="h-[40px] w-[40px]" />
        <Skeleton className="h-[40px] w-[40px]" />
        <Skeleton className="h-[40px] w-[40px]" />
        <Skeleton className="h-[40px] w-[40px]" />
        <Skeleton className="h-[40px] w-[40px]" />
      </div>
      <div className="w-full flex justify-center">
        <Skeleton className="h-[40px] w-[280px] mt-10" />
      </div>
    </div>
  )
}