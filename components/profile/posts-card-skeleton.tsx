import { Skeleton } from "@/components/ui/skeleton"

export default function CardSkeleton() {
  return (
    <div className="px-4 ">
      <Skeleton className="mt-2.5 h-[74px] w-full rounded-xl p-4" />
      <Skeleton className="mt-2.5 h-[74px] w-full rounded-xl p-4" />
    </div>
  )
}