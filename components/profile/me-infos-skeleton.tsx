import { Skeleton } from "@/components/ui/skeleton"

export default function Page() {
  return (
    // <div className="animate-pulse inset-0">
    <div className="inset-0 animate-pulse">
      <Skeleton className="h-[200px]" />
      <section className="relative mt-[-47px] rounded-t-3xl bg-white  pt-12 text-black ">
        <section className="border-b border-b-gray-100 px-4 pb-6">
          <Skeleton className="absolute left-[50%] top-[-47px] ml-[-45px] size-[90px] rounded-full" />
          <div className="flex justify-center">
            <Skeleton className="h-[25px] w-[84px]" />
          </div>
          <div className="mt-2 flex justify-center">
            <Skeleton className="h-[16px] w-[80px]" />
          </div>
          <div className="mt-2 flex  justify-center">
            <Skeleton className="h-[30px] w-[120px]" />
          </div>
          <div className="mt-2 flex  justify-center">
            <Skeleton className="h-[20px] w-full" />
          </div>
          <div className="  mt-2">
            <Skeleton className="h-[20px] w-[56px]" />
          </div>
        </section>
        <div className="flex justify-between p-5">
          <Skeleton className="h-[54px] w-1/5" />
          <Skeleton className="h-[54px] w-1/5" />
          <Skeleton className="h-[54px] w-1/5" />
          <Skeleton className="h-[54px] w-1/5" />
        </div>
        <div className={"border-t border-t-gray-100 px-4 pt-4"}>
          <Skeleton className="h-[94px] w-full" />
        </div>
        <div className={"mt-4 px-4"}>
          <Skeleton className="h-[20px] w-full" />
        </div>
        <div className="flex justify-between p-4 pb-0">
          <Skeleton className="h-[70px] w-[48%]" />
          <Skeleton className="h-[70px] w-[48%]" />
        </div>

      </section>
    </div>
  )
}