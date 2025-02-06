import { Skeleton } from "@/components/ui/skeleton"
export default function CardSkeleton() {
  return (
    <div className="px-4 ">
      <Skeleton className="mt-2.5 rounded-xl w-full h-[74px] p-4" />
      <Skeleton className="mt-2.5 rounded-xl w-full h-[74px] p-4" />
    </div>
  )
}