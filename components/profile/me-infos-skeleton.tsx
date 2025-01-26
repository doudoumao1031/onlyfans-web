import { Skeleton } from "@/components/ui/skeleton"
export default function Page() {
  return (
    // <div className="animate-pulse inset-0">
    <div className="animate-pulse inset-0">
      <Skeleton className="h-[200px]" />
      <section className="mt-[-47px] rounded-t-3xl bg-white relative  pt-12 text-black ">
        <section className="pl-4 pr-4 pb-6 border-b border-b-gray-100">
          <Skeleton className="absolute rounded-full top-[-47px] left-[50%] ml-[-45px] w-[90px] h-[90px]" />
          <div className="flex justify-center">
            <Skeleton className="w-[84px] h-[25px]" />
          </div>
          <div className="flex justify-center mt-2">
            <Skeleton className="w-[80px] h-[16px]" />
          </div>
          <div className="flex justify-center  mt-2">
            <Skeleton className="w-[120px] h-[30px]" />
          </div>
          <div className="flex justify-center  mt-2">
            <Skeleton className="w-full h-[20px]" />
          </div>
          <div className="  mt-2">
            <Skeleton className="w-[56px] h-[20px]" />
          </div>
        </section>
        <div className="p-5 flex justify-between">
          <Skeleton className="w-[20%] h-[54px]" />
          <Skeleton className="w-[20%] h-[54px]" />
          <Skeleton className="w-[20%] h-[54px]" />
          <Skeleton className="w-[20%] h-[54px]" />
        </div>
        <div className={"px-4 pt-4 border-t border-t-gray-100"}>
          <Skeleton className="w-full h-[94px]" />
        </div>
        <div className={"px-4 mt-4"}>
          <Skeleton className="w-full h-[20px]" />
        </div>
        <div className="p-4 pb-0 flex justify-between">
          <Skeleton className="w-[48%] h-[70px]" />
          <Skeleton className="w-[48%] h-[70px]" />
        </div>

      </section>
    </div>
  )
}